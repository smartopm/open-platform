class RemoveUniqueIndexIndexFormsOnNameFromForms < ActiveRecord::Migration[6.0]
  def change
    remove_index :forms, :name
  end
end
