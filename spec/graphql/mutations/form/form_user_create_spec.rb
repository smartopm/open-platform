# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormUserCreate do
  # TODO: Facing parsing error while passing a JSON argument - Saurabh

  # describe 'create for forms' do
  #   let!(:current_user) { create(:user_with_community) }
  #   let!(:admin) { create(:admin_user, community_id: current_user.community_id) }
  #   let!(:form) { create(:form, community_id: current_user.community_id) }
  #   let!(:form_property) { create(:form_property, form: form, field_type: 'text') }

  #   let(:mutation) do
  #     <<~GQL
  #       mutation formUserCreate($formId: ID!, $userId: ID!) {
  #         formUserCreate(formId: $formId, userId: $userId, propValues: $propValue){
  #           formUser {
  #             id
  #           }
  #         }
  #       }
  #     GQL
  #   end

  #   it 'creates a form ' do
  #     variables = {
  #       formId: form.id,
  #       userId: current_user.id,
  #     }
  #     result = DoubleGdpSchema.execute(mutation, variables: variables,
  #                                                context: {
  #                                                  current_user: admin,
  #                                                  site_community: current_user.community,
  #                                                }).as_json
  #   end
  # end
end
