class AddCategoryAndSourceSystemIdToMessages < ActiveRecord::Migration[6.0]
  def change
  	add_column :messages, :source_system_id, :string
  	add_column :messages, :category, :string
  end
end
