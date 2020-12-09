class AddFieldsToEntryRequest < ActiveRecord::Migration[6.0]
  def change
    add_column :entry_requests, :visitation_date, :datetime
    add_column :entry_requests, :start_time, :string
    add_column :entry_requests, :end_time, :string
  end
end
