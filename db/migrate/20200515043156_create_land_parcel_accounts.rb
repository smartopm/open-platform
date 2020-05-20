class CreateLandParcelAccounts < ActiveRecord::Migration[6.0]
  def change
    create_table :land_parcel_accounts, id: false do |t|
      t.references :land_parcel, null: false, type: :uuid, foreign_key: true
      t.references :account, null: false, type: :uuid, foreign_key: true

      t.timestamps
    end
    add_index :land_parcel_accounts, [:land_parcel_id, :account_id], :unique => true
  end
end
