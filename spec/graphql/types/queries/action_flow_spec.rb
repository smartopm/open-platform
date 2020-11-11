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

    describe('events') do
      it 'retrieves available events' do
        result = DoubleGdpSchema.execute(events_query, context: {
                                           current_user: current_user,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'events')).to include(
          'note_comment_create', 'note_comment_update', 'task_update', 'user_login'
        )
      end

      it 'throws unauthorized error if there is no current-user' do
        result = DoubleGdpSchema.execute(events_query, context: {
                                           current_user: nil,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'events')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end

    describe('actions') do
      it 'retrieves available actions' do
        result = DoubleGdpSchema.execute(actions_query, context: {
                                           current_user: current_user,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'actions')).to include('Email')
      end

      it 'throws unauthorized error if there is no current-user' do
        result = DoubleGdpSchema.execute(events_query, context: {
                                           current_user: nil,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'actions')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end

    describe('action fields') do
      it 'retrieves fields for an action' do
        result = DoubleGdpSchema.execute(action_fields_query, context: {
                                           current_user: current_user,
                                           site_community: current_user.community,
                                         }).as_json
        available_fields = result.dig('data', 'actionFields').map { |f| f['name'] }
        expect(available_fields).to include('email', 'template')
      end

      it 'throws unauthorized error if there is no current-user' do
        result = DoubleGdpSchema.execute(events_query, context: {
                                           current_user: nil,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'actionFields')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end

    # rubocop:disable Metrics/LineLength
    describe('action fields') do
      it 'retrieves rule fields' do
        result = DoubleGdpSchema.execute(rule_fields_query, context: {
                                           current_user: current_user,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'ruleFields')).to include(
          'note_id', 'note_user_id', 'note_author_id', 'note_body', 'note_assignees_emails', 'note_url'
        )
      end

      it 'throws unauthorized error if there is no current-user' do
        result = DoubleGdpSchema.execute(events_query, context: {
                                           current_user: nil,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'ruleFields')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
    # rubocop:enable Metrics/LineLength
  end
end
