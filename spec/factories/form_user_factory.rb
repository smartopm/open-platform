# frozen_string_literal: true

FactoryBot.define do
  factory :form_user do
    status { %w[draft pending approved rejected].sample }
    form
    user
    status_updated_by { create(:admin_user) }
  end
end
