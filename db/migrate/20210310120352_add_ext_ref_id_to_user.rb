class AddExtRefIdToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :ext_ref_id, :string
  end
end
