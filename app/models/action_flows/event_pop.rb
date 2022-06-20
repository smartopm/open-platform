# frozen_string_literal: true

module ActionFlows
  # Class to check for JSON rules for events and fire relevant action
  # rubocop:disable Metrics/ClassLength
  class EventPop
    OBJECT_DATA = {
      'User' => {
        'name' => 'Name',
        'id' => 'Id',
        'user_type' => 'User Type',
        'email' => 'Email',
        'phone_number' => 'Phone',
      },
      'Message' => {
        'message' => 'Message',
      },
      'Note' => {
        'id' => '',
        'user_id' => '',
        'author_id' => '',
        'body' => '',
        'assignees_emails' => '',
        'url' => '',
        'updated_by' => '',
        'updated_field' => '',
        'updated_date' => '',
        'new_updated_value' => '',
        'due_at' => '',
      },
      'NoteComment' => {
        'id' => '',
        'user_id' => '',
        'note_id' => '',
        'body' => '',
        'assignees_emails' => '',
        'url' => '',
        'user' => '',
        'due_at' => '',
        'updated_date' => '',
        'note_body' => '',
        'new_body' => '',
      },
      'FormUser' => {
        'id' => '',
        'url' => '',
        'reviewers_email' => '',
        'form_name' => '',
        'user_name' => '',
        'user_id' => '',
        'user_email' => '',
        'status' => '',
        'has_status_changed' => '',
        'form_property_subject' => '',
      },
      'Invoice' => {
        'amount' => '',
        'user_name' => '',
        'user_email' => '',
        'due_date' => '',
        'previous_status' => '',
        'current_status' => '',
      },
      'Deposit' => {
        'amount' => '',
        'status' => '',
        'user_name' => '',
        'user_email' => '',
        'creator' => '',
        'source' => '',
        'destination' => '',
      },
      'VisitRequest' => {
        'reason' => '',
        'start_time' => '',
        'end_time' => '',
        'visitor' => '',
      },
      'TaskAssign' => {
        'user_type' => '',
        'user_id' => '',
        'note_id' => '',
        'author_id' => '',
        'body' => '',
        'user_email' => '',
        'updated_by' => '',
        'updated_date' => '',
        'due_at' => '',
        'url' => '',
      },
      'Lead' => {
        'name' => '',
        'email' => '',
        'temperature' => '',
        'source' => '',
        'owner' => '',
        'type' => '',
        'previous_status' => '',
        'current_status' => '',
        'has_status_changed' => '',
      },
    }.freeze

    attr_accessor :data_set

    def self.event_description
      EVENT_DESC
    end

    def self.event_type
      EVENT_TYPE
    end

    def self.obj_data
      OBJECT_DATA
    end

    def initialize
      @data_set = {}
    end

    def self.event_metadata
      # Rule Builder
      {}
    end

    # rubocop:disable Metrics/AbcSize
    def load_data(data, overwrite_hash = {})
      data.each_key do |key|
        obj_val = self.class.event_metadata[key.to_s]
        obj_val.each_key do |co|
          if overwrite_hash.present? && overwrite_hash.keys.include?(co)
            @data_set["#{key.underscore}_#{co}".to_sym] = overwrite_hash[co]
          else
            @data_set["#{key.underscore}_#{co}".to_sym] = data[key].send(co)
          end
        end
      end
    end
    # rubocop:enable Metrics/AbcSize

    def event_condition
      EventCondition.new(@data_set.to_json)
    end

    def self.event_list
      ActionFlows::Events.constants
                         .map { |const_symbol| ActionFlows::Events.const_get(const_symbol) }
                         .select do |c|
        c.ancestors.exclude?(StandardError) && c.class != Module
      end
    end

    def self.inherited(klass)
      @descendants ||= []
      @descendants << klass
      super
    end

    def self.descendants
      @descendants || []
    end
  end
  # rubocop:enable Metrics/ClassLength
end
