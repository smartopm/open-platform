# frozen_string_literal: true

require 'rails_helper'

# rubocop:disable Layout/LineLength
RSpec.describe UserImportJob, type: :job do
  let!(:non_admin) { create(:user_with_community) }
  let!(:prospective_client_role) { create(:role, name: 'prospective_client') }
  let!(:user) { create(:admin_user, community_id: non_admin.community_id) }
  csv_string = "Name,Email primary,Phone number primary,Phone number secondary 1,Phone number secondary 2,User type,Labels,State,Expiration date,Notes on client\nThomas Shalongolo,thomas@gmail.com,+234979063360,,,Prospective Client,Residency program Waitlist;Some other label,valid,,some notes here\nJide Babs,jide@gmail.com,+260979013360,,,Prospective Client,Residency program Waitlist;Some other label,pending,,some notes here"
  semicolon_csv_string = "Name;Email primary;Phone number primary;Phone number secondary 1;Phone number secondary 2;User type;Labels;State;Expiration date;Notes on client\nJohn Doe;john@gmail.com;+234979063360;;;Prospective Client;Residency program Waitlist,Some other label;valid;;some notes here\nJane Doe;jane@gmail.com;+260979013360;;;Prospective Client;Residency program Waitlist,Some other label;pending;;some notes here"

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

    it 'should create new users' do
      prev_user_count = Users::User.count
      ActiveJob::Base.queue_adapter.perform_enqueued_jobs = true

      UserImportJob.perform_later(csv_string, 'A File.csv', user)

      expect(Users::User.count).to eql(prev_user_count + 2)
    end

    it 'should not create users if no contact info is supplied' do
      csv_string = "Name,Email primary,Phone number primary,Phone number secondary 1,Phone number secondary 2,User type,Labels,State,Expiration date,Notes on client\nThomas Shalongolo,sha@gmail.com,+234970013360,,,Prospective Client,Residency program Waitlist;Some other label,valid,,some notes here\nJide Babs,,,,,Prospective Client,Residency program Waitlist;Some other label,pending,,some notes here"
      prev_user_count = Users::User.count
      ActiveJob::Base.queue_adapter.perform_enqueued_jobs = true

      UserImportJob.perform_later(csv_string, 'A File.csv', user)

      expect(Users::User.count).to eql(prev_user_count)
    end

    context 'when CSV string is semicolon separated' do
      it 'is expected to create new users' do
        prev_user_count = Users::User.count
        ActiveJob::Base.queue_adapter.perform_enqueued_jobs = true

        UserImportJob.perform_later(semicolon_csv_string, 'A File.csv', user)

        expect(Users::User.count).to eql(prev_user_count + 2)
      end
    end
  end
end
# rubocop:enable Layout/LineLength
