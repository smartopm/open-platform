# frozen_string_literal: true

require 'rails_helper'

# rubocop:disable Layout/LineLength
RSpec.describe UserImportJob, type: :job do
  let!(:non_admin) { create(:user_with_community) }
  let!(:prospective_client_role) { create(:role, name: 'prospective_client') }
  let!(:user) { create(:admin_user, community_id: non_admin.community_id) }
  csv_string = "Name,Title,Email,Secondary Email,Secondary Phone\nThomas Shalongolo,CFO,thomas@gmail.com,'thomas_s@gmail.com,'9988776655"

  describe '#perform_later' do
    before do
      ActiveJob::Base.queue_adapter = :test
    end
    after do
      clear_enqueued_jobs
      clear_performed_jobs
    end
    it 'should match enqueued job arguments' do
      LeadImportJob.perform_later(csv_string, 'lead_management.csv', user)
      expect(LeadImportJob).to have_been_enqueued.with(csv_string, 'lead_management.csv', user)
    end

    it 'should create new users' do
      prev_user_count = Users::User.count
      prev_note_count = Notes::Note.count
      ActiveJob::Base.queue_adapter.perform_enqueued_jobs = true

      LeadImportJob.perform_later(csv_string, 'lead_management.csv', user)

      expect(Users::User.count).to eql(prev_user_count + 1)
      expect(Notes::Note.count).to eql(prev_note_count + 1)
    end

    it 'should not create users if name is not present' do
      csv_string = "Name,Title,Email\n,CFO,'thomas@gmail.com'"
      prev_user_count = Users::User.count
      ActiveJob::Base.queue_adapter.perform_enqueued_jobs = true

      LeadImportJob.perform_later(csv_string, 'lead_management.csv', user)

      expect(Users::User.count).to eql(prev_user_count)
    end

    it 'should not create users if no contact info is supplied' do
      csv_string = "Name,Title,Email\nThomas Shalongolo,CFO,"
      prev_user_count = Users::User.count
      ActiveJob::Base.queue_adapter.perform_enqueued_jobs = true

      LeadImportJob.perform_later(csv_string, 'lead_management.csv', user)

      expect(Users::User.count).to eql(prev_user_count)
    end
  end
end
# rubocop:enable Layout/LineLength
