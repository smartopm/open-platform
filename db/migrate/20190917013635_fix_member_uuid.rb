class FixMemberUuid < ActiveRecord::Migration[6.0]
  def change
    drop_table :members
    create_table "members", id: :uuid, force: :cascade do |t|
      t.datetime "created_at", precision: 6, null: false
      t.datetime "updated_at", precision: 6, null: false
      t.uuid "user_id"
      t.uuid "community_id"
      t.string "member_type"
      t.datetime "expires_at"
      t.string "id_token"
    end
    drop_table :roles
  end
end
