class CreateFormUserTable < ActiveRecord::Migration[6.0]
  def change
    create_table :form_users, id: :uuid do |t|
      t.belongs_to :user, type: :uuid, null: false, foreign_key: true
      t.belongs_to :form, type: :uuid, null: false, foreign_key: true
      t.integer :status

      t.timestamps
    end
  end
end
