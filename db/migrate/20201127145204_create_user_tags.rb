class CreateUserTags < ActiveRecord::Migration[6.0]
  def change
    create_table :post_tag_users, id: :uuid do |t|
      t.references :user, null: false, type: :uuid, foreign_key: true
      t.references :post_tag, null: false, type: :uuid, foreign_key: true

      t.timestamps
    end
    add_index :post_tag_users, [:user_id, :post_tag_id], :unique => true
  end
end
