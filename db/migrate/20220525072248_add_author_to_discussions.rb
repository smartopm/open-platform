class AddAuthorToDiscussions < ActiveRecord::Migration[6.1]
  def change
    add_column :discussions, :author, :integer, default: 0
  end
end
