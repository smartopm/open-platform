class AddTemplateToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :templates, :json
  end
end
