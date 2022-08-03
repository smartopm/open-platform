# frozen_string_literal: true

FactoryBot.define do
  factory :form_user, class: 'Forms::FormUser' do
    status { %w[draft pending approved rejected].sample }
    form
    user
    submitted_by_id { user.id }
    status_updated_by { create(:admin_user) }
  end
end
