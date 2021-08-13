class AddCategoryReferencetoFormProperties < ActiveRecord::Migration[6.0]
  def change
    add_reference :form_properties, :category, type: :uuid, foreign_key: true
  end
end
