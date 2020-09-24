class AddStatusToComment < ActiveRecord::Migration[6.0]
  def change
    add_column :comments, :status, :string
    add_index :comments, :status
    Comment.update_all(status: "valid")
  end
end
