class CreateUserFormPropertiesTable < ActiveRecord::Migration[6.0]
  def change
    create_table :user_form_properties, id: :uuid do |t|
      t.belongs_to :form_properties, type: :uuid, null: false, foreign_key: true
      t.belongs_to :form_user, type: :uuid, null: false, foreign_key: true
      t.string :value
      t.timestamps
    end
  end
end
