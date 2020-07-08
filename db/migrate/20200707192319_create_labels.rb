class CreateLabels < ActiveRecord::Migration[6.0]
  def change
    create_table :labels, id: :uuid do |t|
      t.string :short_desc
      t.references :community, null: false, type: :uuid, foreign_key: true

      t.timestamps
    end
  end
end
