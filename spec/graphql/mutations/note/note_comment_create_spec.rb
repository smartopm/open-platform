# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::NoteCommentCreate do
  describe 'create for note comment' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:custodian_role) { create(:role, name: 'custodian') }
    let!(:site_worker_role) { create(:role, name: 'site_worker') }
    let!(:permission) do
      create(:permission, module: 'note',
                          role: custodian_role,
                          permissions: %w[can_create_note_comment])
    end
    let!(:site_worker_permission) do
      create(:permission, module: 'note',
                          role: site_worker_role,
                          permissions: %w[can_create_note_comment])
    end

    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id, role: admin_role) }

    let!(:another_user) { create(:store_custodian, role: custodian_role) }
    let!(:site_worker) do
      create(:site_worker, community_id: another_user.community_id,
                           role: site_worker_role)
    end

    let!(:email_template) do
      create(:email_template, community: user.community, name: 'Generic Template')
    end

    let!(:note) do
      admin.notes.create!(
        body: 'Note body',
        user_id: user.id,
        community_id: user.community_id,
        author_id: admin.id,
      )
    end
    let!(:comment) do
      note.note_comments.create!(
        user_id: admin.id,
        status: 'active',
        body: 'This is the first comment',
        reply_required: true,
        reply_from_id: another_user.id,
        grouping_id: '9fafaba8-ad19-4a08-97e4-9b670d482cfa',
      )
    end
    let(:query) do
      <<~GQL
        mutation noteCommentCreate($noteId: ID!, $body: String!, $replyRequired: Boolean, $replyFromId: ID, $groupingId: ID) {
          noteCommentCreate(noteId: $noteId, body: $body, replyRequired: $replyRequired, replyFromId: $replyFromId, groupingId: $groupingId){
            noteComment {
              id
              body
              replyFrom {
                name
              }
            }
          }
        }
      GQL
    end

    it 'creates a comment under note' do
      variables = {
        noteId: note.id,
        body: 'Comment body',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: another_user,
                                                site_community: another_user.community,
                                              }).as_json
      expect(result.dig('data', 'noteCommentCreate', 'noteComment', 'id')).not_to be_nil
      expect(result.dig('data', 'noteCommentCreate', 'noteComment', 'body')).to eql 'Comment body'
      expect(result['errors']).to be_nil
    end

    it 'creates a reply-required comment under note' do
      variables = {
        noteId: note.id,
        body: 'A reply is required body',
        replyRequired: true,
        replyFromId: site_worker.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: another_user,
                                                site_community: another_user.community,
                                              }).as_json
      expect(result.dig('data', 'noteCommentCreate', 'noteComment', 'id')).not_to be_nil
      expect(result.dig('data', 'noteCommentCreate', 'noteComment', 'body')).to eql(
        'A reply is required body',
      )
      expect(result.dig('data', 'noteCommentCreate', 'noteComment', 'replyFrom', 'name')).to eql(
        site_worker.name,
      )
      expect(result['errors']).to be_nil
    end

    it 'raises an error if not is not found' do
      variables = {
        noteId: '1234',
        body: 'A reply is required body',
        replyRequired: true,
        replyFromId: site_worker.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: another_user,
                                                site_community: another_user.community,
                                              }).as_json
      expect(
        result.dig('errors', 0, 'message'),
      ).to eql 'Validation failed: Note must exist'
    end

    # rubocop:disable Layout/LineLength
    it 'creates a replied comment and update previous one as replied' do
      another_user.update!(community_id: admin.community.id)

      variables = {
        noteId: note.id,
        body: 'This is a reply to your comment',
        replyRequired: true,
        replyFromId: admin.id,
        groupingId: '9fafaba8-ad19-4a08-97e4-9b670d482cfa',
      }

      path = "/processes/drc/projects/#{note.id}?tab=processes&detailTab=comments&replying_discussion=9fafaba8-ad19-4a08-97e4-9b670d482cfa"
      action_url = "https://#{HostEnv.base_url(admin.community)}#{path}"
      email_body = I18n.t('email_template.comment_reply.body',
                          note_body: note.body,
                          note_due_at: (note.due_date&.strftime('%Y-%m-%d') || 'Never'),
                          user_name: another_user.name,
                          comment_created_at: Time.current.strftime('%Y-%m-%d'))
      email_subject = I18n.t('email_template.comment_reply.subject', user_name: another_user.name)

      expect(EmailMsg).to receive(:send_mail_from_db).with(
        email: admin.email,
        template: email_template,
        template_data: [
          { key: '%action_url%', value: action_url },
          { key: '%action%', value: I18n.t('email_template.comment_reply.action') },
          { key: '%body%', value:  email_body },
          { key: '%title%', value: I18n.t('email_template.comment_reply.title') },
        ],
        email_subject: email_subject,
      )

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: another_user,
                                                site_community: another_user.community,
                                              }).as_json

      expect(comment.reload.replied_at).not_to be_nil
      expect(result.dig('data', 'noteCommentCreate', 'noteComment', 'id')).not_to be_nil
      expect(result.dig('data', 'noteCommentCreate', 'noteComment', 'body')).to eql(
        'This is a reply to your comment',
      )
      expect(result['errors']).to be_nil
    end
    # rubocop:enable Layout/LineLength

    it 'creates a comment under note with current user as site worker' do
      variables = {
        noteId: note.id,
        body: 'Site worker Comment',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: site_worker,
                                                site_community: site_worker.community,
                                              }).as_json
      expect(result.dig('data', 'noteCommentCreate', 'noteComment', 'id')).not_to be_nil
      expect(result.dig('data', 'noteCommentCreate', 'noteComment', 'body'))
        .to eql 'Site worker Comment'
      expect(result['errors']).to be_nil
    end

    it 'raises unauthorized error if the context does not have current user' do
      variables = {
        noteId: note.id,
        body: 'Comment body',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                              }).as_json
      expect(result.dig('errors', 0, 'message')).to include('Unauthorized')
      expect(result['errors']).not_to be_nil
    end
  end
end
