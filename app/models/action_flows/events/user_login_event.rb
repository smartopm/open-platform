module ActionFlows
    module Events
        class UserLoginEvent < ActionFlows::EventPop
            EVENT_TYPE='user_login'
            EVENT_DESC='User Login'

            def self.event_metadata
                {
                    'User' => self.obj_data['User']
                }
            end

            def self.event_metadata_list
              #  UserLoginEvent.event_metadata.values.map{|v| v.values }
            end

            def initialize
                super
            end

            def setup_data(event_log)
                load_data({'User' => event_log.acting_user})
            end
        end
    end
end
