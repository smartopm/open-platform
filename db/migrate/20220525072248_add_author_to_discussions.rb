class AddAuthorToDiscussions < ActiveRecord::Migration[6.1]
  def change
    add_column :discussions, :tag, :integer, default: 0
  end
end
