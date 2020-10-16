class AddStatusToDiscussions < ActiveRecord::Migration[6.0]
  def change
    add_column :discussions, :status, :string
    add_index :discussions, :status
    Discussion.update_all(status: "valid")
  end
end
