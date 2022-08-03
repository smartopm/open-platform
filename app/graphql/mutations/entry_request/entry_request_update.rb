# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Create a new request/pending member
    class EntryRequestUpdate < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false
      argument :email, String, required: false
      argument :nrc, String, required: false
      argument :phone_number, String, required: false
      argument :vehicle_plate, String, required: false
      argument :reason, String, required: false
      argument :other_reason, String, required: false
      argument :concern_flag, GraphQL::Types::Boolean, required: false
      argument :visitation_date, String, required: false
      argument :starts_at, String, required: false
      argument :ends_at, String, required: false
      argument :company_name, String, required: false
      argument :temperature, String, required: false
      argument :occurs_on, [String], required: false
      argument :visit_end_date, String, required: false
      argument :video_blob_id, String, required: false
      argument :image_blob_ids, [String], required: false
      argument :status, String, required: false

      field :entry_request, Types::EntryRequestType, null: true

      def resolve(vals)
        entry_request = context[:site_community].entry_requests.find(vals.delete(:id))

        if entry_request.update(vals.except(:video_blob_id, :image_blob_ids, :temperature))
          remove_attachments(entry_request, vals)
          add_attachments(entry_request, vals)
          return { entry_request: entry_request }
        end

        raise GraphQL::ExecutionError, entry_request.errors.full_messages
      end

      def add_attachments(entry_request, vals)
        return if entry_request.nil?

        entry_request.video.attach(vals[:video_blob_id]) if vals[:video_blob_id]
        entry_request.images.attach(vals[:image_blob_ids]) if vals[:image_blob_ids].present?
      end

      def remove_attachments(entry_request, vals)
        return if entry_request.nil?

        entry_request.video.purge if vals[:video_blob_id] && entry_request.video.attached?

        entry_request.images.purge if vals[:image_blob_ids] && entry_request.images.attached?
      end

      def authorized?(vals)
        entry_request = Logs::EntryRequest.find_by(id: vals[:id])
        raise_entry_request_not_found_error(entry_request)

        return true if current_user_is_host?(entry_request) ||
                       permitted?(module: :entry_request,
                                  permission: :can_update_entry_request)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      # @return [GraphQL::ExecutionError]
      def raise_entry_request_not_found_error(entry_request)
        return if entry_request

        raise GraphQL::ExecutionError, I18n.t('errors.entry_request.not_found')
      end

      # Returns true if current user is the host of entry request
      #
      # @return [Boolean]
      def current_user_is_host?(entry_request)
        return true if entry_request.user_id.eql?(context[:current_user].id)
      end
    end
  end
end
