class AddCompanyNameToEntryRequests < ActiveRecord::Migration[6.0]
  def change
    add_column :entry_requests, :company_name, :string
  end
end
