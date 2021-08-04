class UpdateSubAdministratorField < ActiveRecord::Migration[6.0]
  def change
    remove_column :communities, :sub_administrator, :string
    add_column :communities, :sub_administrator_id, :uuid
  end
end
