class CreateEvents < ActiveRecord::Migration[6.0]
  def up
    # Only one way, but non destructive and idempotent
    ActivityLog.all.each  do |a|
      p "Updating #{a.id}"
      p a.update_or_create_event_log
    end
  end

  def down
    p "Nothing to undo"
  end
end
