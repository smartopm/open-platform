class AddOccurenceToEntryRequest < ActiveRecord::Migration[6.0]
  def change
    add_column :entry_requests, :occurs_on, :string, array: true, default: []
    add_column :entry_requests, :visit_end_date, :datetime
  end
end
