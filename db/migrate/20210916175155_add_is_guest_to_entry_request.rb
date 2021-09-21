class AddIsGuestToEntryRequest < ActiveRecord::Migration[6.0]
  def change
    add_column :entry_requests, :is_guest, :boolean, default: false
  end
end
