module ActionFlows
    class EventCondition
        attr_reader :json_condition
        attr_reader :json_data

        def initialize(json_data)
            @json_data = json_data
        end

        def run_condition(json_condition)
            @json_condition = json_condition
            condition = JSON.parse(@json_condition)
            data = JSON.parse(@json_data)
            JSONLogic.apply( condition, data )
        end
    end
end