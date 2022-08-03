class AddIsPublicToForms < ActiveRecord::Migration[6.1]
  def change
    add_column :forms, :is_public, :boolean
  end
end
