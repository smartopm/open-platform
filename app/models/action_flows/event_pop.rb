# frozen_string_literal: true

require_relative './events/'
module ActionFlows
  # Class to check for JSON rules for events and fire relevant action
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
      },
      'NoteComment' => {
        'id' => '',
        'user_id' => '',
        'note_id' => '',
        'body' => '',
        'assignees_emails' => '',
        'url' => '',
      },
      'FormUser' => {
        'id' => '',
        'url' => '',
        'reviewers_email' => '',
        'form_name' => '',
        'user_name' => '',
        'user_email' => '',
        'status' => '',
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
      data.keys.each do |key|
        obj_val = self.class.event_metadata[key.to_s]
        obj_val.keys.each do |co|
          if overwrite_hash.present? && overwrite_hash.keys.include?(co)
            @data_set["#{key.underscore}_#{co}".to_sym] = overwrite_hash[co]
          else
            @data_set["#{key.underscore}_#{co}".to_sym] = data.dig(key).send(co)
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
        !c.ancestors.include?(StandardError) && c.class != Module
      end
    end

    def self.inherited(klass)
      @descendants ||= []
      @descendants << klass
    end

    def self.descendants
      @descendants || []
    end
  end
end
