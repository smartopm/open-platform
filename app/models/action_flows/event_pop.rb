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
        'subject' => '',
        'assignees' => [],
      },
    }.freeze

    # To be fetched dynamically later : Saurabh
    RULE = {
      "if": [
        { "===": [{ "var": 'note_subject' }, 'task_update'] },
        ['email', { "var": 'note_assignees' }],
        [],
      ],
    }.freeze

    DATA_RULE = {
      "if": [
        { "===": [{ "var": 'note_subject' }, 'task_update'] },
        ['task_name', { "var": 'note_body' }, 'url', { "var": 'note_id' }],
        [],
      ],
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

    # rubocop:disable Rails/Output
    def load_data(data)
      data.keys.each do |key|
        obj_val = self.class.event_metadata[key.to_s]
        obj_val.keys.each do |co|
          puts co
          @data_set["#{key.to_s.downcase}_#{co}".to_sym] = data.dig(key, co)
        end
      end
    end
    # rubocop:enable Rails/Output

    def event_condition
      EventCondition.new(@data_set.to_json)
    end

    def run_condition
      result = event_condition.run_condition(RULE.to_json)
      return if result.empty?

      action = result.first
      user_list = result.last
      "ActionFlows::Actions::#{action.camelize}".constantize.run_action(user_list, data_json)
    end

    # rubocop:disable Metrics/MethodLength
    def data_json
      hash = {}
      data = event_condition.run_condition(DATA_RULE.to_json)
      start_index = 0
      end_index = data.length
      while start_index < end_index
        key = data[start_index]
        value = key.eql?('url') ? url_format(data[start_index + 1]) : data[start_index + 1]
        hash[key] = value
        start_index += 2
      end
      hash
    end
    # rubocop:enable Metrics/MethodLength

    def self.event_list
      # ActionFlows::Events.constants
      #                    .map { |const_symbol| ActionFlows::Events.const_get(const_symbol) }
      #                    .select { |c|
      #                      !c.ancestors.include?(StandardError) && c.class != Module
      #                     }
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
