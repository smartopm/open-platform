class AddPreviewToForms < ActiveRecord::Migration[6.0]
  def change
    add_column :forms, :preview, :boolean
  end
end
