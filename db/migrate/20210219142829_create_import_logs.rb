class CreateImportLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :import_logs, id: :uuid do |t|
      t.string :file_name
      t.boolean :failed, default: false
      t.json :import_errors
      t.references :community, null: false, type: :uuid, foreign_key: true
      t.references :user, null: false, type: :uuid, foreign_key: true

      t.timestamps
    end
  end
end
