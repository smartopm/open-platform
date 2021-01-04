# frozen_string_literal: true

require 'rails_helper'

# rubocop:disable Layout/LineLength
RSpec.describe Mutations::User::Import do
  describe 'Import' do
    let!(:non_admin) { create(:user_with_community) }
    let!(:user) { create(:admin_user, community_id: non_admin.community_id) }

    let(:query) do
      <<~GQL
        mutation usersImport($csvString: String!) {
          usersImport(csvString: $csvString) {
            errors
            noOfDuplicates
            noOfValid
            noOfInvalid
          }
        }
      GQL
    end

    it 'creates a bulk import and returns an empty error message' do
      prev_user_count = User.count
      prev_contact_info = ContactInfo.count

      variables = {
        csvString: "Name,Email primary,Phone number primary,Phone number secondary 1,Phone number secondary 2,User type,Labels,State,Expiration date,Notes on client\nThomas Shalongolo,thomas@gmail.com,+234979063360,,,Prospective Client,Residency program Waitlist;Some other label,valid,,some notes here\nJide Babs,jide@gmail.com,+260979013360,,,Prospective Client,Residency program Waitlist;Some other label,pending,,some notes here",
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json

      expect(JSON.parse(result.dig('data', 'usersImport', 'errors'))).to eq({})
      expect(User.count).to eql(prev_user_count + 2)
      expect(ContactInfo.count).to eql(prev_contact_info + 4)
      expect(result.dig('data', 'usersImport', 'noOfDuplicates')).to eql(0)
      expect(result.dig('data', 'usersImport', 'noOfValid')).to eql(2)
      expect(result.dig('data', 'usersImport', 'noOfInvalid')).to eql(0)
    end

    it "returns an error message if there's any and doesn't create anything" do
      prev_user_count = User.count
      prev_contact_info = ContactInfo.count

      variables = {
        csvString: "Name,Email primary,Phone number primary,Phone number secondary 1,Phone number secondary 2,User type,Labels,State,Expiration date,Notes on client\nThomas Shalongolo,thomas@gmail.com,+23497a063360,,,Prospective Client,Residency program Waitlist;Some other label,valid,,some notes here\nJide Babs,jide@gmail.com,+2609,,,Prospective Client,Residency program Waitlist;Some other label,spending,,some notes here",
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json

      errors = JSON.parse(result.dig('data', 'usersImport', 'errors'))
      expect(errors['1']).to include("Phone number can only contain 0-9, '-', '+' and space")
      expect(errors['2']).to include('State is not included in the list', 'Phone number must be a valid length')
      expect(User.count).to eql(prev_user_count)
      expect(ContactInfo.count).to eql(prev_contact_info)
      expect(result.dig('data', 'usersImport', 'noOfDuplicates')).to eql(0)
      expect(result.dig('data', 'usersImport', 'noOfValid')).to eql(0)
      expect(result.dig('data', 'usersImport', 'noOfInvalid')).to eql(2)
    end

    it "raises 'Unauthorized' error if user is not logged in" do
      variables = {
        csvString: "Name,Email primary,Phone number primary,Phone number secondary 1,Phone number secondary 2,User type,Labels,State,Expiration date,Notes on client\nThomas Shalongolo,thomas@gmail.com,+234979063360,,,Prospective Client,Residency program Waitlist;Some other label,valid,,some notes here\nJide Babs,jide@gmail.com,+260979013360,,,Prospective Client,Residency program Waitlist;Some other label,pending,,some notes here",
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
