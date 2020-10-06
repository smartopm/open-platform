class CreateFormsTable < ActiveRecord::Migration[6.0]
  def change
    create_table :forms, id: :uuid do |t|
      t.string :name
      t.belongs_to :community, type: :uuid, null: false, foreign_key: true
      t.datetime :expires_at

      t.timestamps
    end
  end
end
