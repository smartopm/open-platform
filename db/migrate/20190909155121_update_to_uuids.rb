class UpdateToUuids < ActiveRecord::Migration[6.0]
  def change
    drop_table :users
    create_table "users", id: :uuid do |t|
      t.string "name"
      t.string "email"
      t.string "provider"
      t.string "uid"
      t.string "token"
      t.boolean "expires"
      t.datetime "expires_at"
      t.string "refresh_token"
      t.string "image_url"
      t.timestamps
      t.index ["email"], name: "index_users_on_email", unique: true
      t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
    end
  end
end
