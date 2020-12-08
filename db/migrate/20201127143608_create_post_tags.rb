class CreatePostTags < ActiveRecord::Migration[6.0]
  def change
    create_table :post_tags, id: :uuid do |t|
      t.string :name
      t.string :slug

      t.timestamps
    end
  end
end
