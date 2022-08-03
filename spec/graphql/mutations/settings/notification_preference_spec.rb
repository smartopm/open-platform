# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Settings::NotificationPreference do
  describe 'Add or Update user notification preferences' do
    let!(:user) { create(:resident) }

    let(:query) do
      <<~GQL
        mutation notificationPreference($preferences: String!) {
          notificationPreference(preferences: $preferences){
            __typename
          }
        }
      GQL
    end

    it 'should add a relation between user and the preference label' do
      variables = {
        preferences: 'com_news_sms,com_news_email,weekly_point_reminder_email',
      }

      expect(user.labels.count).to eql 3
      DoubleGdpSchema.execute(query, variables: variables, context: {
                                current_user: user,
                                site_community: user.community,
                              }).as_json
      expect(user.labels.count).to eql 3
      expect(user.labels.pluck(:short_desc))
        .to include('com_news_sms', 'com_news_email', 'weekly_point_reminder_email')
    end

    it 'should update relation between user and the preference label' do
      expect(user.labels.count).to eql 3
      DoubleGdpSchema.execute(query, variables: { preferences: 'com_news_sms' },
                                     context: {
                                       current_user: user,
                                       site_community: user.community,
                                     }).as_json
      expect(user.labels.count).to eql 1
      expect(user.labels[0].short_desc).to eql 'com_news_sms'

      DoubleGdpSchema.execute(query, variables: { preferences: 'com_news_email' },
                                     context: {
                                       current_user: user,
                                       site_community: user.community,
                                     }).as_json

      expect(user.reload.labels.count).to eql 1
      expect(user.labels[0].short_desc).to eql 'com_news_email'

      DoubleGdpSchema.execute(query, variables: { preferences: 'weekly_point_reminder_email' },
                                     context: {
                                       current_user: user,
                                       site_community: user.community,
                                     }).as_json

      expect(user.reload.labels.count).to eql 1
      expect(user.labels[0].short_desc).to eql 'weekly_point_reminder_email'
    end
  end
end
