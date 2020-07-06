class RemovePostIdInComments < ActiveRecord::Migration[6.0]
  def change
    remove_column :comments, :post_id
    add_column :comments, :discussion_id, :uuid
  end
end
