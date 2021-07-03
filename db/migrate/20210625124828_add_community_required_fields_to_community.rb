class AddCommunityRequiredFieldsToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :community_required_fields, :json
  end
end
