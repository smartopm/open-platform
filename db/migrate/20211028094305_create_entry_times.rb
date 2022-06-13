class CreateEntryTimes < ActiveRecord::Migration[6.1]
  def change
    create_table :entry_times, id: :uuid do |t|
      t.datetime :visitation_date
      t.datetime :visit_end_date
      t.datetime :starts_at
      t.datetime :ends_at
      t.string :occurs_on, default: [], array: true
      t.uuid :visitable_id
      t.string :visitable_type
      t.references :community, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end
    add_index :entry_times, [:visitable_id, :visitable_type], :unique => true
  end
end
