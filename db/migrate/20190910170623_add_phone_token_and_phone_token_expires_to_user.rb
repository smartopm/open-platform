class AddPhoneTokenAndPhoneTokenExpiresToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :phone_token, :string
    add_column :users, :phone_token_expires_at, :datetime
  end
end
