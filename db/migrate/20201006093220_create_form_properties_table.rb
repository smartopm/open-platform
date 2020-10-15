class CreateFormPropertiesTable < ActiveRecord::Migration[6.0]
  def change
    create_table :form_properties, id: :uuid do |t|
      t.string :order
      t.string :field_name
      t.integer :field_type
      t.boolean :required, default: false
      t.string :short_desc
      t.string :long_desc
      t.boolean :admin_use, default: false
      t.belongs_to :form, type: :uuid, null: false, foreign_key: true
      t.timestamps
    end
  end
end
