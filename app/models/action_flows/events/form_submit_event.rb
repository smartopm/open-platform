# frozen_string_literal: true

require 'host_env'

module ActionFlows
  module Events
    # Form Submit Event to handle related action
    class FormSubmitEvent < ActionFlows::EventPop
      EVENT_TYPE = 'form_submit'
      EVENT_DESC = 'Form Submit'

      def self.event_metadata
        {
          'FormUser' => obj_data['FormUser'],
        }
      end

      def self.event_metadata_list
        {
          #  FormSubmitEvent.event_metadata.values.map{|v| v.values }
        }
      end

      def self.event_description
        EVENT_DESC
      end

      def self.event_type
        EVENT_TYPE
      end

      # rubocop:disable Metrics/MethodLength
      def preload_data(eventlog)
        form_user = eventlog.ref_type.constantize.find eventlog.ref_id
        reviewers_email = '' # to be initialized with comma separated emails
        load_data(
          { 'FormUser' => form_user },
          'form_name' => form_user.form.name,
          'user_name' => form_user.user.name,
          'user_email' => form_user.user.email,
          'user_id' => form_user.user.id,
          'reviewers_email' => reviewers_email,
          'url' => url_format(eventlog.community),
          'has_status_changed' => false,
          'form_property_subject' => report_an_issue_subject(form_user),
        )
      end
      # rubocop:enable Metrics/MethodLength

      def url_format(community)
        "https://#{HostEnv.base_url(community)}/forms"
      end

      def report_an_issue_subject(form_user)
        return unless form_user.form.report_an_issue?

        subject_property = form_user.user_form_properties.find do |f|
          %w[Subject Asunto].include?(f.form_property.field_name)
        end

        subject_property&.value
      end
    end
  end
end
