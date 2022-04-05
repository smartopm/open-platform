class CreateProcesses < ActiveRecord::Migration[6.1]
  def change
    create_table :processes, id: :uuid do |t|
      t.string :process_type
      t.string :name
      t.references :community, null: false, foreign_key: true, type: :uuid
      t.references :form, null: true, foreign_key: true, type: :uuid

      t.timestamps
    end
    add_reference :note_lists, :process, type: :uuid, foreign_key: { to_table: :processes }
  end
end
