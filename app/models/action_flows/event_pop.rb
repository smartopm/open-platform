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
        }   
    }
    attr_accessor :data_set
    def self.obj_data 
        OBJECT_DATA
    end
    def initialize 
        @data_set ={}
    end

    def self.event_metadata
        {}
    end

    def load_data(data)
        data.keys.each{| key |
            obj_val = self.class.event_metadata[key]
            obj_val.keys.each { | co |
            puts co
                @data_set["#{key}-#{co}"] = data[key].send(co)  
            }
        }
    end

    def event_condition
        EventCondition.new(@data_set.to_json)
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

#
#class EventCondition
#    attr_reader :json_condition
#    attr_reader :json_data
#
#    def initialize(json_condition, json_data)
#        @json_condition = json_condition
#        @json_data = json_data
#    end
#
#    def run_condition
#        condition =  JSON.parse(@json_condition)
#        data =  JSON.parse(@json_data)
#        JSONLogic.apply( condition, data )
#    end
#end
#
#class EventAction
#    attr_reader :json_condition
#    attr_reader :json_data
#
#    def initialize(json_condition, json_data)
#        @json_condition = json_condition
#        @json_data = json_data
#    end
#
#    def run_condition
#        condition =  JSON.parse(@json_condition)
#        data =  JSON.parse(@json_data)
#        JSONLogic.apply( condition, data )
#    end
#end
end
