class CreateAccounts < ActiveRecord::Migration[6.0]
  def change
    create_table :accounts, id: :uuid do |t|
      t.references :community, null: false, type: :uuid, foreign_key: true
      t.references :user, null: false, type: :uuid, foreign_key: true
      t.string :full_name
      t.string :address1
      t.string :address2
      t.string :city
      t.string :postal_code
      t.string :state_province
      t.string :country

      t.timestamps
    end
  end
end
