class AddEmailColumnEntryRequests < ActiveRecord::Migration[6.0]
  def change
    add_column :entry_requests, :email, :string
  end
end
