# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Community::CommunityUpdate do
  describe 'updating a community' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:admin) { create(:admin_user, community_id: resident.community_id, role: admin_role) }
    let!(:resident) { create(:resident, role: resident_role) }
    let!(:community_admin_permission) do
      create(:permission, module: 'community',
                          role: admin_role, permissions: ['can_update_community_details'])
    end

    let(:update_community) do
      <<~GQL
        mutation communityUpdate($name: String, $supportNumber: JSON, $supportEmail: JSON, $supportWhatsapp: JSON, $socialLinks: JSON, $features: JSON, $leadMonthlyTargets: JSON){
          communityUpdate(name: $name, supportNumber: $supportNumber, supportEmail: $supportEmail, supportWhatsapp: $supportWhatsapp, socialLinks: $socialLinks,
            features: $features, leadMonthlyTargets: $leadMonthlyTargets){
            community {
                id
                name
                supportEmail
                supportWhatsapp
                socialLinks
                features
                leadMonthlyTargets
            }
          }
        }
      GQL
    end

    it 'updates a community' do
      email = [{ email: 'abs@g.c', category: 'sales' }]
      whatsapp = [{ whatsapp: '09034567823', category: 'customer_care' }]
      social_links = [{ social_link: 'www.facebook.com', category: 'facebook' }]
      features = { LogBook: { features: ['Sub Feature 1'] } }
      lead_monthly_targets = { India: 3, China: 2, Europe: 4 }
      variables = {
        name: 'Awesome Name',
        supportEmail: email.to_json,
        supportWhatsapp: whatsapp.to_json,
        socialLinks: social_links.to_json,
        features: features.to_json,
        leadMonthlyTargets: lead_monthly_targets.to_json,
      }
      result = DoubleGdpSchema.execute(update_community, variables: variables,
                                                         context: {
                                                           current_user: admin,
                                                           site_community: resident.community,
                                                           user_role: admin.role,
                                                         }).as_json

      community = result.dig('data', 'communityUpdate', 'community')
      expect(community['id']).to_not be_nil
      expect(community['name']).to include 'Awesome Name'
      expect(community['supportEmail']).to eq(email.to_json)
      expect(community['supportWhatsapp']).to eq(whatsapp.to_json)
      expect(community['socialLinks']).to eq(social_links.to_json)
      expect(community['features']).to eq(features.to_json)
      expect(result['errors']).to be_nil
      expect(community['leadMonthlyTargets']).to eql lead_monthly_targets.to_json
    end

    it 'throws unauthorized error when user is not admin' do
      variables = {
        name: 'Nkwashi Name',
        supportEmail: [{ email: 'abs@g.c', category: 'sales' }].to_json,
      }
      result = DoubleGdpSchema.execute(update_community, variables: variables,
                                                         context: {
                                                           current_user: resident,
                                                           site_community: resident.community,
                                                           user_role: resident.role,
                                                         }).as_json
      expect(result.dig('data', 'communityUpdate', 'community', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
