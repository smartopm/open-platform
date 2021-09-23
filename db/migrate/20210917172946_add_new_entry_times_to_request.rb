class AddNewEntryTimesToRequest < ActiveRecord::Migration[6.0]
  def change
    add_column :entry_requests, :starts_at, :datetime
    add_column :entry_requests, :ends_at, :datetime
  end
end
