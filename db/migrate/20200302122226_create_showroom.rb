class CreateShowroom < ActiveRecord::Migration[6.0]
  def change
    create_table :showrooms, id: :uuid do |t|
      t.string :userId
      t.string :name
      t.string :email
      t.string :home_address
      t.string :phone_number
      t.string :nrc
      t.string :reason
      t.string :source

      t.timestamps
    end
  end
end
