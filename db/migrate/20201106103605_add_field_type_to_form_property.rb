class AddFieldTypeToFormProperty < ActiveRecord::Migration[6.0]
  def change
    add_column :form_properties, :field_value, :json
  end
end
