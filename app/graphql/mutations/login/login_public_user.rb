# frozen_string_literal: true

module Mutations
  module Login
    # Login a public user
    class LoginPublicUser < BaseMutation
      field :auth_token, String, null: true

      def resolve
        user = context[:site_community].users.find_by(name: 'Public Submission')

        { auth_token: user.auth_token }
      end
    end
  end
end
