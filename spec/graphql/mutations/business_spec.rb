# frozen_string_literal: true

require 'rails_helper'

# rubocop:disable Metrics/LineLength
RSpec.describe Mutations::Business do
  let!(:current_user) { create(:user_with_community, user_type: 'admin') }

  # create a business for the user
  let!(:user_business) do
    create(:business, user_id: current_user.id, community_id: current_user.community_id)
  end
    
  let(:query) do
    <<~GQL
      mutation DeleteBusiness(
        $id: ID!
      ) {
        businessDelete(
          id: $id
          ){
            businessDelete
          }
        }
    GQL
  end

  it 'deletes a business' do
    variables = {
      id: user_business.id
    }

    result = DoubleGdpSchema.execute(query, variables: variables,
                                            context: {
                                              current_user: current_user,
                                              site_community: current_user.community,
                                            }).as_json
    puts "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    puts result
    puts user_business.id
    puts "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    expect(result.dig('errors')).to be_nil
  end
end
# rubocop:enable Metrics/LineLength
