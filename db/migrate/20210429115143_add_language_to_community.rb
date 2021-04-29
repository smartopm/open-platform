class AddLanguageToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :language, :string
  end
end
