class ChangeExpiresAt < ActiveRecord::Migration[6.0]
  def change
    rename_column :users, :expires_at, :oauth_expires_at
    rename_column :users, :expires, :oauth_expires
    add_column :users, :expires_at, :datetime
  end
end
