# frozen_string_literal: true

require 'rails_helper'

# rubocop:disable Layout/LineLength
RSpec.describe Mutations::User::Import do
  describe 'Import' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'user',
                          role: admin_role,
                          permissions: %w[can_import_users])
    end

    let!(:non_admin) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:user) do
      create(:admin_user, community_id: non_admin.community_id, role: admin_role,
                          user_type: 'admin')
    end

    let(:query) do
      <<~GQL
        mutation usersImport($csvString: String!, $csvFileName: String!, $importType: String!) {
          usersImport(csvString: $csvString, csvFileName: $csvFileName, importType: $importType) {
            success
          }
        }
      GQL
    end

    it 'calls UsersImportJob' do
      csv_string = "Name,Email primary,Phone number primary,Phone number secondary 1,Phone number secondary 2,User type,Labels,State,Expiration date,Notes on client\nThomas Shalongolo,thomas@gmail.com,+234979063360,,,Prospective Client,Residency program Waitlist;Some other label,valid,,some notes here\nJide Babs,jide@gmail.com,+260979013360,,,Prospective Client,Residency program Waitlist;Some other label,pending,,some notes here"
      variables = {
        csvString: csv_string,
        csvFileName: 'My File.csv',
        importType: 'user',
      }
      expect(UserImportJob).to receive(:perform_later).with(csv_string, 'My File.csv', user)
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json

      expect(result.dig('data', 'usersImport', 'success')).to eql(true)
    end

    it 'calls LeadImportJob' do
      csv_string = "Name,Title,Email\nThomas Shalongolo,CFO,thomas@gmail.com"
      variables = {
        csvString: csv_string,
        csvFileName: 'lead_management.csv',
        importType: 'lead',
      }
      expect(LeadImportJob).to receive(:perform_later).with(csv_string, 'lead_management.csv', user)
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json

      expect(result.dig('data', 'usersImport', 'success')).to eql(true)
    end

    it "raises 'Unauthorized' error if user is not logged in" do
      variables = {
        csvString: "Name,Email primary,Phone number primary,Phone number secondary 1,Phone number secondary 2,User type,Labels,State,Expiration date,Notes on client\nThomas Shalongolo,thomas@gmail.com,+234979063360,,,Prospective Client,Residency program Waitlist;Some other label,valid,,some notes here\nJide Babs,jide@gmail.com,+260979013360,,,Prospective Client,Residency program Waitlist;Some other label,pending,,some notes here",
        csvFileName: 'My File.csv',
        importType: 'user',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: nil,
                                              }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to eq('Unauthorized')
    end

    it "raises 'Unauthorized' error if user is not an admin" do
      variables = {
        csvString: "Name,Email primary,Phone number primary,Phone number secondary 1,Phone number secondary 2,User type,Labels,State,Expiration date,Notes on client\nThomas Shalongolo,thomas@gmail.com,+234979063360,,,Prospective Client,Residency program Waitlist;Some other label,valid,,some notes here\nJide Babs,jide@gmail.com,+260979013360,,,Prospective Client,Residency program Waitlist;Some other label,pending,,some notes here",
        csvFileName: 'My File.csv',
        importType: 'user',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: non_admin,
                                              }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to eq('Unauthorized')
    end
  end
end
# rubocop:enable Layout/LineLength
