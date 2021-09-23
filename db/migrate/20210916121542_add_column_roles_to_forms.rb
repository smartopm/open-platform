class AddColumnRolesToForms < ActiveRecord::Migration[6.0]
  def change
    add_column :forms, :roles, :string, array: true, default: []
  end
end
