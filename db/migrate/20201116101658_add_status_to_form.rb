class AddStatusToForm < ActiveRecord::Migration[6.0]
  def change
    add_column :forms, :status, :integer
    add_column :forms, :description, :text
  end
end
