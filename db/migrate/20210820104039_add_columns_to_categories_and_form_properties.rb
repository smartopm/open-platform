class AddColumnsToCategoriesAndFormProperties < ActiveRecord::Migration[6.0]
  def change
    add_column :categories, :display_condition, :json
    add_column :form_properties, :grouping_id, :uuid, default: -> { "gen_random_uuid()" }
  end
end
