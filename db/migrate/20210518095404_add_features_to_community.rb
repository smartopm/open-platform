class AddFeaturesToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :features, :json
  end
end
