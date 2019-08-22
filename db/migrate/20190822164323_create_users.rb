class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :provider
      t.string :uid
      t.string :token
      t.boolean :expires
      t.datetime :expires_at
      t.string :refresh_token
      t.timestamps
    end
    add_index :users, :email, unique: true
    add_index :users, [:uid, :provider], unique: true
  end

end
