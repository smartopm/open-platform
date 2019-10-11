class DropMembersAddRequests < ActiveRecord::Migration[6.0]
  def change
    drop_table :members
    add_column :users, :user_type, :string
    add_column :users, :request_reason, :string
    add_column :users, :request_status, :string
    add_column :users, :request_note, :text
    add_column :users, :vehicle, :string
    add_column :users, :community_id, :uuid
    add_column :users, :last_activity_at, :datetime
    add_column :activity_logs, :user_id, :uuid
    add_column :activity_logs, :reporting_user_id, :uuid
    remove_column :activity_logs, :reporting_member_id
    remove_column :activity_logs, :member_id
  end
end
