class ChangeColumnAddNotNullToPosts < ActiveRecord::Migration[6.1]
  def change
    change_column :posts, :content, :string, null: false
  end
end
