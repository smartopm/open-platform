class AddIsCompanyToEntryRequest < ActiveRecord::Migration[6.1]
  def change
    add_column :entry_requests, :is_company, :boolean
  end
end
