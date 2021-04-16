class AddTagLineToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :tagline, :string
  end
end
