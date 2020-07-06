class CreateDiscussionUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :discussion_users, id: false do |t|
      t.references :user, null: false, type: :uuid, foreign_key: true
      t.references :discussion, null: false, type: :uuid, foreign_key: true

      t.timestamps
    end
    add_index :discussion_users, [:user_id, :discussion_id], :unique => true
  end
end
