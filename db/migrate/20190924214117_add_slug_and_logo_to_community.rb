class AddSlugAndLogoToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :slug, :string
    add_column :communities, :logo_url, :string

    add_index(:communities, :slug, unique: true)

  end
end
