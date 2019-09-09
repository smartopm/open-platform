class AddCommunityIdToMember < ActiveRecord::Migration[6.0]
  def change
    add_column :members, :community_id, :uuid
    remove_column :members, :comunity_id
  end
end
