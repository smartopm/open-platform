class AddUsernamePasswordPasswordResetTokenSignInCountToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :username, :string, unique: true, null: false, default: ""
    add_column :users, :encrypted_password, :string, null: false, default: ""
    add_column :users, :reset_password_token, :string, null: false, unique: true, default: ""
    add_column :users, :sign_in_count, :integer, null: false, default: 0
  end
end
