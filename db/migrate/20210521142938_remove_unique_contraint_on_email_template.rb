class RemoveUniqueContraintOnEmailTemplate < ActiveRecord::Migration[6.0]
  def change
    remove_index :email_templates, :name
    add_index :email_templates, [:name, :community_id], unique: true
  end
end
