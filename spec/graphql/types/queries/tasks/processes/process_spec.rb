# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Note do
  describe 'Process queries' do
    let(:admin_role) { create(:role, name: 'admin') }
    let(:site_worker_role) { create(:role, name: 'site_worker') }
    let!(:permission) do
      create(:permission, module: 'note',
                          role: admin_role,
                          permissions: %w[
                            can_fetch_task_comments
                            can_fetch_flagged_notes
                            can_fetch_task_by_id
                            can_fetch_task_histories
                            can_get_task_count
                            can_get_task_stats
                            can_get_own_tasks
                            can_fetch_all_notes
                            can_fetch_user_notes
                            can_fetch_tagged_comments
                            can_view_task_lists
                            can_get_comment_stats
                            can_get_replies_requested_comments
                            can_fetch_process_comments
                            can_fetch_project_document_comments
                          ])
    end
    let!(:site_worker_permission) do
      create(:permission, module: 'note',
                          role: site_worker_role,
                          permissions: %w[can_fetch_task_comments can_fetch_flagged_notes
                                          can_fetch_task_by_id can_fetch_task_histories
                                          can_get_task_count can_get_task_stats can_get_own_tasks])
    end
    let(:site_worker) { create(:site_worker, role: site_worker_role) }
    let(:community) { site_worker.community }
    let!(:admin) do
      create(:admin_user, role: admin_role, community: community, name: 'John Doe')
    end
    let(:searchable_user) { create(:user, name: 'Henry Tim', community_id: community.id) }

    let(:developer_role) { create(:role, name: 'developer', community: community) }
    let(:developer) { create(:developer, role: developer_role, community: community) }
    let!(:developer_permissions) do
      create(:permission, module: 'note',
                          role: developer_role,
                          permissions: %w[can_fetch_flagged_notes can_fetch_task_comments
                                          can_fetch_tagged_comments])
    end
    let(:consultant_role) { create(:role, name: 'consultant', community: community) }
    let(:consultant) { create(:consultant, role: consultant_role, community: community) }
    let!(:consultant_permissions) do
      create(:permission, module: 'note',
                          role: consultant_role,
                          permissions: %w[can_fetch_flagged_notes can_fetch_task_comments
                                          can_fetch_comments_on_assigned_tasks])
    end

    let!(:parent_task1) do
      admin.notes.create!(
        body: 'Parent Task 1',
        description: 'Test parent task 1',
        user_id: site_worker.id,
        category: 'form',
        flagged: true,
        community_id: community.id,
        author_id: site_worker.id,
        completed: false,
      )
    end

    let!(:parent_task2) do
      admin.notes.create!(
        body: 'Parent Task 2',
        description: 'Test parent task 2',
        user_id: site_worker.id,
        category: 'form',
        flagged: true,
        community_id: community.id,
        author_id: site_worker.id,
        due_date: Time.zone.now.end_of_day,
        completed: false,
      )
    end

    let!(:first_task_comment) do
      create(:note_comment,
             note: parent_task1,
             body: 'Test task comment',
             user: site_worker,
             status: 'active')
    end

    let(:second_task_comment) do
      create(:note_comment,
             note: parent_task2,
             user: site_worker,
             status: 'active')
    end

    let(:form) do
      create(:form, name: 'DRC Project Review Process', community: community)
    end

    let(:process) do
      create(:process,
             process_type: 'drc',
             name: 'DRC',
             form_id: form.id,
             community: community)
    end

    let(:another_form) do
      create(:form, name: 'DRC Project Review Process V2', community: community)
    end

    let(:form_user) { create(:form_user, form: form, user: admin, status_updated_by: admin) }

    let(:another_form_user) do
      create(:form_user, form: form, user: admin, status_updated_by: admin)
    end

    describe '#process_comments' do
      let(:process_comments_query) do
        <<~GQL
          query processComments($processId: ID!) {
            processComments(processId: $processId) {
              id
              body
              createdAt
              replyFrom {
                id
                name
              }
            }
          }
        GQL
      end

      before do
        process
        parent_task1.update(form_user_id: form_user.id, completed: true)
      end

      it 'raises error when user has no permissions' do
        variables = { processId: process.id }
        result = DoubleGdpSchema.execute(process_comments_query, variables: variables,
                                                                 context: {
                                                                   current_user: site_worker,
                                                                   site_community: community,
                                                                 }).as_json

        expect(result.dig('errors', 0, 'message')).to include('Unauthorized')
      end

      it 'raises error if process is not found' do
        variables = { processId: 'Non existent process' }
        result = DoubleGdpSchema.execute(process_comments_query, variables: variables,
                                                                 context: {
                                                                   current_user: admin,
                                                                   site_community: admin.community,
                                                                 }).as_json

        expect(result.dig('errors', 0, 'message')).to include('not found')
      end

      it 'returns all process comments' do
        process_comment = create(
          :note_comment,
          note: parent_task1,
          body: 'Parent Task 1 comment',
          user: site_worker,
          status: 'active',
          reply_required: true,
          reply_from: admin,
          grouping_id: '6d3f82c5-5d74-471d-a5a9-143f6e5ad3f1',
        )

        create(
          :note_comment,
          note: parent_task2,
          body: 'Another process comment',
          user: site_worker,
          status: 'active',
          reply_required: true,
          reply_from: nil,
          grouping_id: nil,
        )

        variables = { processId: process.id }
        result = DoubleGdpSchema.execute(process_comments_query,
                                         variables: variables,
                                         context: {
                                           current_user: admin,
                                           site_community: admin.community,
                                         }).as_json

        expect(result.dig('data', 'processComments').size).to eq 2
        expect(result.dig('data', 'processComments', 0, 'body')).to include(process_comment.body)
        expect(result.dig('data', 'processComments', 1, 'body')).to include(first_task_comment.body)
      end
    end
  end
end
