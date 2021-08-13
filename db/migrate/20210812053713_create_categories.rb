class CreateCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :categories, id: :uuid do |t|
      t.string :field_name
      t.string :description
      t.integer :order
      t.boolean :header_visible
      t.text :rendered_text
      t.boolean :general, default: false
      t.uuid :form_property_id
      t.references :form, null: false, type: :uuid, foreign_key: true

      t.timestamps
    end
  end
end
