class AddLinksColumnToBusiness < ActiveRecord::Migration[6.0]
  def change
    add_column :businesses, :links, :json
  end
end
