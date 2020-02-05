class AddAcknowledgedToEntryRequest < ActiveRecord::Migration[6.0]
  def change
    add_column :entry_requests, :acknowledged, :boolean
  end
end
