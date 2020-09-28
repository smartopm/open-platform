class AddArticlesSharedToActivityPoint < ActiveRecord::Migration[6.0]
  def change
    add_column :activity_points, :article_shared, :integer, default: 0
    rename_column :activity_points, :article, :article_read
  end
end
