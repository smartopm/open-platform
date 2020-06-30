class CreateBusinesses < ActiveRecord::Migration[6.0]
  def change
    create_table :businesses, id: :uuid do |t|
      t.references :community, null: false, type: :uuid, foreign_key: true
      t.references :user, null: false, type: :uuid, foreign_key: true
      t.string :name
      t.string :status
      t.string :home_url
      t.string :category
      t.text :description
      t.string :image_url
      t.string :email
      t.string :phone_number
      t.string :address
      t.string :operation_hours

      t.timestamps
    end
  end
end
