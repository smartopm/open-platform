class AddSubAdministratorToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :sub_administrator, :string
  end
end
