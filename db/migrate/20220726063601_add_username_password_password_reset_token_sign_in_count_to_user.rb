class AddUsernamePasswordPasswordResetTokenSignInCountToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :username, :string, unique: true
    add_column :users, :encrypted_password, :string
    add_column :users, :reset_password, :boolean, null: false, default: false

    ## Recoverable
    add_column :users, :reset_password_token, :string, null: true
    add_column :users, :reset_password_sent_at, :datetime, null: true
    add_index :users, [:username, :community_id], unique: true
  end
end
