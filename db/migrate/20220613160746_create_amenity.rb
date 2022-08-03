class CreateAmenity < ActiveRecord::Migration[6.1]
  def change
    create_table :amenities, id: :uuid do |t|
      t.string :name
      t.text :description
      t.string :location
      t.string :hours
      t.string :invitation_link

      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :community, null: false, foreign_key: true, type: :uuid
      t.timestamps
    end
  end
end
