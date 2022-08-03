class AddExitedAtToEntryRequest < ActiveRecord::Migration[6.1]
  def change
    add_column :entry_requests, :exited_at, :datetime
  end
end
