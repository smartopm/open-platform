class AddUsernamePasswordPasswordResetTokenSignInCountToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :username, :string, unique: true, null: false, default: ""
    add_column :users, :encrypted_password, :string, null: false, default: ""

    ## Recoverable
    add_column :users, :reset_password_token, :string, null: true
    add_column :users, :reset_password_sent_at, :datetime, null: true

    ## Trackable
    add_column :users, :sign_in_count, :integer, null: false, default: 0
    add_column :users, :current_sign_in_at, :datetime
    add_column :users, :last_sign_in_at, :datetime
    add_column :users, :current_sign_in_ip, :string
    add_column :users, :last_sign_in_ip, :string
  end
end
