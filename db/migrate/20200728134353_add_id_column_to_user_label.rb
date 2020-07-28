class AddIdColumnToUserLabel < ActiveRecord::Migration[6.0]
  def change
    add_column :user_labels, :id, :primary_key
  end
end
