# frozen_string_literal: true

module Mutations
  module Community
    # Updating community details
    class CommunityUpdate < BaseMutation
      argument :name, String, required: false
      argument :support_number, GraphQL::Types::JSON, required: false
      argument :support_email, GraphQL::Types::JSON, required: false
      argument :support_whatsapp, GraphQL::Types::JSON, required: false
      argument :social_links, GraphQL::Types::JSON, required: false
      argument :menu_items, GraphQL::Types::JSON, required: false
      argument :image_blob_id, String, required: false
      argument :currency, String, required: false
      argument :locale, String, required: false
      argument :tagline, String, required: false
      argument :logo_url, String, required: false
      argument :language, String, required: false
      argument :wp_link, String, required: false
      argument :security_manager, String, required: false
      argument :sub_administrator_id, String, required: false
      argument :theme_colors, GraphQL::Types::JSON, required: false
      argument :banking_details, GraphQL::Types::JSON, required: false
      argument :sms_phone_numbers, [String, { null: true }], required: false
      argument :emergency_call_number, String, required: false
      argument :templates, GraphQL::Types::JSON, required: false
      argument :features, GraphQL::Types::JSON, required: false
      argument :ga_id, String, required: false
      argument :lead_monthly_targets, GraphQL::Types::JSON, required: false

      field :community, Types::CommunityType, null: true

      def resolve(vals)
        community = context[:site_community].update(vals.except(:image_blob_id))

        context[:site_community].attach_image(vals) if vals[:image_blob_id].present?

        return { community: context[:site_community] } if community

        raise GraphQL::ExecutionError, community.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(admin: true, module: :community,
                                  permission: :can_update_community_details)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
