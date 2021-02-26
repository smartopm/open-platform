# frozen_string_literal: true

require 'rails_helper'

# rubocop:disable Layout/LineLength
RSpec.describe UserImportJob, type: :job do
  let!(:non_admin) { create(:user_with_community) }
  let!(:user) { create(:admin_user, community_id: non_admin.community_id) }
  csv_string = "Name,Email primary,Phone number primary,Phone number secondary 1,Phone number secondary 2,User type,Labels,State,Expiration date,Notes on client\nThomas Shalongolo,thomas@gmail.com,+234979063360,,,Prospective Client,Residency program Waitlist;Some other label,valid,,some notes here\nJide Babs,jide@gmail.com,+260979013360,,,Prospective Client,Residency program Waitlist;Some other label,pending,,some notes here"

  describe '#perform_later' do
    before do
      ActiveJob::Base.queue_adapter = :test
    end
    after do
      clear_enqueued_jobs
      clear_performed_jobs
    end
    it 'should match enqueued job arguments' do
      UserImportJob.perform_later(csv_string, 'A File.csv', user)
      expect(UserImportJob).to have_been_enqueued.with(csv_string, 'A File.csv', user)
    end

    it 'should update assignee_note reminder_job_id with new job id' do
      prev_user_count = User.count
      ActiveJob::Base.queue_adapter.perform_enqueued_jobs = true

      UserImportJob.perform_later(csv_string, 'A File.csv', user)

      expect(User.count).to eql(prev_user_count + 2)
    end
  end
end
# rubocop:enable Layout/LineLength