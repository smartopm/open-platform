class CreateUserLabels < ActiveRecord::Migration[6.0]
  def change
    create_table :user_labels, id: false do |t|
      t.references :user, null: false, type: :uuid, foreign_key: true
      t.references :label, null: false, type: :uuid, foreign_key: true

      t.timestamps
    end
    add_index :user_labels, [:user_id, :label_id], :unique => true
  end
end
