class AddVersionNumberToForm < ActiveRecord::Migration[6.0]
  def change
    add_column :forms, :version_number, :integer
  end
end
