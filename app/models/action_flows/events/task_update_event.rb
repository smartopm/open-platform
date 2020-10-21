module ActionFlows
  module Events
    class TaskUpdateEvent < ActionFlows::EventPop
      EVENT_TYPE='note_update'
      EVENT_DESC='Note Update'

      def self.event_metadata
        {
          'Note' => self.obj_data['Note']
        }
      end

      def self.event_metadata_list
        {
          
        }
        #  TaskUpdateEvent.event_metadata.values.map{|v| v.values }
      end

      def initialize
        super
      end

      def setup_data(note)
        load_data({'Note' => note})
      end
    end
  end
end
