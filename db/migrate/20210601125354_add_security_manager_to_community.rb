class AddSecurityManagerToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :security_manager, :string
  end
end
