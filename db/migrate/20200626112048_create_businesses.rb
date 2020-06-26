class CreateBusinesses < ActiveRecord::Migration[6.0]
  def change
    create_table :businesses, id: :uuid do |t|
      t.references :community, null: false, type: :uuid, foreign_key: true
      t.references :user, null: false, type: :uuid, foreign_key: true
      t.string :name
      t.boolean :verified
      t.string :home_url
      t.string :category
      t.text :description
      t.string :image_url

      t.timestamps
    end
  end
end
