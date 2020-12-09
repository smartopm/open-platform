# frozen_string_literal: true

module Mutations
  module Upload
    # CreateUploadInput per rails activestore
    class CreateUploadInput < GraphQL::Schema::InputObject
      description 'File information required to prepare a direct upload'

      argument :filename, String, 'Original file name', required: true
      argument :byte_size, Int, 'File size (bytes)', required: true
      argument :checksum, String, 'MD5 file checksum as base64', required: true
      argument :content_type, String, 'File content type', required: true
    end

    # What Rails returns from activestore
    class Attachment < GraphQL::Schema::Object
      description 'Represents direct upload credentials'

      field :upload_url, String, 'Upload URL', null: false
      field :url, String, 'URL for item', null: false
      field :headers, String,
            'HTTP request headers (JSON-encoded)',
            null: false
      field :blob_id, ID, 'Created blob record ID', null: false
      field :signed_blob_id, ID,
            'Created blob record signed ID',
            null: false
    end

    # Out actual mutation for upload
    class CreateAttachment < BaseMutation
      argument :input, CreateUploadInput, required: true

      field :attachment, Attachment, null: false

      def resolve(input:)
        set_host
        blob = ActiveStorage::Blob.create_before_direct_upload!(input.to_h)

        {
          attachment: attachment(blob),
        }
      end

      def attachment(blob)
        {
          upload_url: blob.service_url_for_direct_upload,
          url: blob.service_url,
          # NOTE: we pass headers as JSON since they have no schema
          headers: blob.service_headers_for_direct_upload.to_json,
          blob_id: blob.id,
          signed_blob_id: blob.signed_id,
        }
      end

      def authorized?(_vars)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user

        true
      end

      private

      def set_host
        ActiveStorage::Current.host = Rails.application.routes.default_url_options[:protocol] +
                                      '://' + context[:site_hostname]
      end
    end
  end
end
