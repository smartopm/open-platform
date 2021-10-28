class AddGuestIdToEntryRequest < ActiveRecord::Migration[6.1]
  def change
    add_column :entry_requests, :guest_id, :uuid
  end
end
