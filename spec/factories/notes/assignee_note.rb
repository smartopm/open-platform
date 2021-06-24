# frozen_string_literal: true

FactoryBot.define do
  factory :assignee_note, class: 'Notes::AssigneeNote' do
    note
    user
    reminder_time { nil }
    reminder_job_id { nil }
  end
end
