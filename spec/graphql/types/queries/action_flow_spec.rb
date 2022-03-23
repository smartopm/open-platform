# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::ActionFlow do
  describe 'actionflow queries' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'action_flow',
                          role: admin_role,
                          permissions: %w[
                            can_get_action_flow_list
                            can_get_action_flow_rule_fields
                            can_get_action_flow_events
                            can_get_action_flow_actions
                            can_get_action_flow_action_fields
                          ])
    end
    let!(:current_user) do
      create(:user_with_community,
             user_type: 'resident',
             role: resident_role)
    end
    let!(:admin) do
      create(:user_with_community,
             user_type: 'admin',
             role: admin_role)
    end

    let(:events_query) do
      %(query {
          events
        })
    end
    let(:actions_query) do
      %(query {
          actions
        })
    end

    let(:email_action_fields_query) do
      %(query {
        actionFields(action: "email") {
            name
            type
          }
        })
    end

    let(:notification_action_fields_query) do
      %(query {
        actionFields(action: "notification") {
            name
            type
          }
        })
    end

    let(:task_action_fields_query) do
      %(query {
        actionFields(action: "task") {
            name
            type
          }
        })
    end

    let(:rule_fields_query) do
      %(query {
        ruleFields(eventType: "task_update")
      })
    end

    let(:action_flows_query) do
      %(query {
            actionFlows {
                title
                description
            }
        })
    end

    describe('events') do
      it 'retrieves available events when user is admin' do
        result = DoubleGdpSchema.execute(events_query, context: {
                                           current_user: admin,
                                           site_community: admin.community,
                                         }).as_json
        expect(result.dig('data', 'events')).to include(
          'note_comment_create', 'note_comment_update', 'task_update', 'user_login'
        )
      end

      it 'throws login error if there is no current-user' do
        result = DoubleGdpSchema.execute(events_query, context: {
                                           current_user: nil,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'events')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eq 'Unauthorized'
      end

      it 'throws unauthorized error if current-user is not admin' do
        result = DoubleGdpSchema.execute(events_query, context: {
                                           current_user: current_user,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'events')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end

    describe('actions') do
      it 'retrieves available actions when user is admin' do
        result = DoubleGdpSchema.execute(actions_query, context: {
                                           current_user: admin,
                                           site_community: admin.community,
                                         }).as_json
        expect(result.dig('data', 'actions')).to include('Notification')
        expect(result.dig('data', 'actions')).to include('Task')
      end

      it 'throws login error if there is no current-user' do
        result = DoubleGdpSchema.execute(events_query, context: {
                                           current_user: nil,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'actions')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eq 'Unauthorized'
      end

      it 'throws unauthorized error if current-user is not admin' do
        result = DoubleGdpSchema.execute(events_query, context: {
                                           current_user: current_user,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'actions')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end

    describe('action fields') do
      it 'retrieves fields for notification action when user is admin' do
        result = DoubleGdpSchema.execute(notification_action_fields_query, context: {
                                           current_user: admin,
                                           site_community: admin.community,
                                         }).as_json
        available_fields = result.dig('data', 'actionFields').map { |f| f['name'] }
        expect(available_fields).to include('label', 'user_id', 'message')
      end

      it 'retrieves fields for task action when user is admin' do
        result = DoubleGdpSchema.execute(task_action_fields_query, context: {
                                           current_user: admin,
                                           site_community: admin.community,
                                         }).as_json
        available_fields = result.dig('data', 'actionFields').map { |f| f['name'] }
        expect(available_fields).to include('body', 'description',
                                            'category', 'assignees',
                                            'user_id', 'due_date',
                                            'author_id')
      end

      it 'throws login error if there is no current-user' do
        result = DoubleGdpSchema.execute(events_query, context: {
                                           current_user: nil,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'actionFields')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eq 'Unauthorized'
      end

      it 'throws unauthorized error if current-user is not admin' do
        result = DoubleGdpSchema.execute(events_query, context: {
                                           current_user: current_user,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'actionFields')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end

    # rubocop:disable Layout/LineLength
    describe('rule fields') do
      it 'retrieves rule fields when user is admin' do
        result = DoubleGdpSchema.execute(rule_fields_query, context: {
                                           current_user: admin,
                                           site_community: admin.community,
                                         }).as_json
        expect(result.dig('data', 'ruleFields')).to include(
          'note_id', 'note_user_id', 'note_author_id', 'note_body', 'note_assignees_emails', 'note_url'
        )
      end

      it 'throws lgoin error if there is no current-user' do
        result = DoubleGdpSchema.execute(events_query, context: {
                                           current_user: nil,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'ruleFields')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eq 'Unauthorized'
      end

      it 'throws unauthorized error if current-user is not admin' do
        result = DoubleGdpSchema.execute(events_query, context: {
                                           current_user: current_user,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'ruleFields')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
    # rubocop:enable Layout/LineLength

    describe('action flows') do
      let!(:flow1) do
        create(:action_flow, event_type: 'task_update', title: 'Flow One',
                             community_id: admin.community_id)
      end
      let!(:flow2) do
        create(:action_flow, event_type: 'task_update', title: 'Flow Two',
                             community_id: admin.community_id)
      end

      it 'retrieves all action flows when user is admin' do
        result = DoubleGdpSchema.execute(action_flows_query, context: {
                                           current_user: admin,
                                           site_community: admin.community,
                                         }).as_json

        titles = result.dig('data', 'actionFlows').map { |f| f['title'] }
        expect(result.dig('data', 'actionFlows').length).to eql 2
        expect(titles).to include('Flow One', 'Flow Two')
      end

      it 'throws login error if there is no current-user' do
        result = DoubleGdpSchema.execute(events_query, context: {
                                           current_user: nil,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'actionFields')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eq 'Unauthorized'
      end

      it 'throws unauthorized error if current-user is not admin' do
        result = DoubleGdpSchema.execute(events_query, context: {
                                           current_user: current_user,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'actionFields')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
