require_relative './events/'
module ActionFlows
  class EventPop
    OBJECT_DATA = {
      'User' => {
        'name' => 'Name',
        'id' => 'Id',
        'user_type' => 'User Type',
        'email' => 'Email',
        'phone_number' => 'Phone'
      },
      'Message' => {
        'message' => 'Message'
      },
      'Note' => {
        'id' => '',
        'user_id' => '',
        'author_id' => '',
        'body' => '',
        'subject' => '',
      }
    }

    # To be fetched dynamically later : Saurabh
    RULE = { 
      "if": [
        {"===": [{"var": "note_subject"}, 'task_update']},
        ["email", {"var": "note_user_id"}],
        []
      ]
    }

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
      @data_set ={}
    end

    def self.event_metadata
      # Rule Builder
      {} 
    end

    def load_data(data)
      data.keys.each{| key |
        obj_val = self.class.event_metadata[key.to_s]
        obj_val.keys.each { | co |
        puts co
          @data_set["#{key.to_s.downcase}_#{co}".to_sym] = data.dig(key, co)
        }
      }
    end

    def event_condition
      EventCondition.new(@data_set.to_json)
    end

    def run_condition
      result = event_condition.run_condition(RULE.to_json)
      return if result.empty?

      action = result.first
      user_list = result[1..]
      "ActionFlows::Actions::#{action.camelize}".constantize.run_action(user_list)
    end

    def self.event_list
      ActionFlows::Events.constants.map { |const_symbol| ActionFlows::Events.const_get(const_symbol) }.select { |c| !c.ancestors.include?(StandardError) && c.class != Module }
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
