class AddIndexToPostTag < ActiveRecord::Migration[6.0]
  def change
    add_index :post_tags, :name, unique: true
  end
end
