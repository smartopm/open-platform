# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::ActionFlow do
  describe 'actionflow queries' do
    let!(:current_user) { create(:user_with_community) }

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

    let(:action_fields_query) do
      %(query {
        actionFields(action: "email") {
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

    it 'retrieves available events' do
      result = DoubleGdpSchema.execute(events_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'events')).to include("note_comment_create", "note_comment_update", "task_update", "user_login")
    end

    it 'retrieves available actions' do
      result = DoubleGdpSchema.execute(actions_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'actions')).to include("Email")
    end

    it 'retrieves fields for an action' do
      result = DoubleGdpSchema.execute(action_fields_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      available_fields = result.dig('data', 'actionFields').map { |f| f['name'] }
      expect(available_fields).to include('email', 'template')
    end

    it 'retrieves rule fields' do
      result = DoubleGdpSchema.execute(rule_fields_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'ruleFields')).to include("note_id", "note_user_id", "note_author_id", "note_body", "note_assignees_emails", "note_url")
    end
  end
end
