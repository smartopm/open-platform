# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note do
  describe 'creating feedback review' do
    let!(:user) { create(:user_with_community) }

    let(:query) do
      <<~GQL
        mutation FeedbackCreate($isThumbsUp: Boolean!, $review: String) {
            feedbackCreate(isThumbsUp: $isThumbsUp, review: $review) {
            feedback {
                id
                user {
                    id
                    name
                    }
                isThumbsUp
            }
            }
        }
      GQL
    end

    it 'creates feedback' do
      variables = {
        isThumbsUp: true,
        review: 'Feedback given',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('data', 'feedbackCreate', 'feedback', 'id')).not_to be_nil
      expect(result.dig('data', 'feedbackCreate', 'feedback', 'isThumbsUp')).to eql true
      expect(result.dig('errors')).to be_nil
    end
  end
end
