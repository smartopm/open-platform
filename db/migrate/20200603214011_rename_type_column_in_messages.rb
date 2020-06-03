class RenameTypeColumnInMessages < ActiveRecord::Migration[6.0]
  def change
    rename_column :messages, :type, :category
  end
end
