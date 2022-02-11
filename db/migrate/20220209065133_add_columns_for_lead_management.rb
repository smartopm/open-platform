class AddColumnsForLeadManagement < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :title, :string
    add_column :users, :linkedin_url, :string
    add_column :users, :company_name, :string
    add_column :users, :country, :string
    add_column :users, :company_description, :string
    add_column :users, :company_linkedin, :string
    add_column :users, :company_website, :string
    add_column :users, :company_employees, :string
    add_column :users, :company_annual_revenue, :string
    add_column :users, :company_contacted, :string
    add_column :users, :industry_sub_sector, :string
    add_column :users, :industry_business_activity, :string
    add_column :users, :industry, :string
    add_column :users, :level_of_internationalization, :string
    add_column :users, :lead_temperature, :string
    add_column :users, :lead_status, :string
    add_column :users, :lead_source, :string
    add_column :users, :lead_owner, :string
    add_column :users, :lead_type, :string
    add_column :users, :client_category, :string
    add_column :users, :next_steps, :text
    add_column :users, :last_contact_date, :datetime
    add_column :users, :modified_by, :string
    add_column :users, :first_contact_date, :datetime
    add_column :users, :created_by, :string
    add_column :users, :relevant_link, :string
    add_column :users, :contact_details, :jsonb
    add_column :users, :african_presence, :string
    add_column :users, :region, :string
  end
end
