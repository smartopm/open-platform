class AddFieldsToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :source, :string
    add_column :users, :stage, :string
    add_column :users, :owner_id, :uuid
    add_column :users, :id_number, :string
    add_column :users, :followup_date, :datetime
  end
end
