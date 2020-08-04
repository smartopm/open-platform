class AddCommunityIdToNotes < ActiveRecord::Migration[6.0]
  def change
    add_column :notes, :community_id, :uuid
  end
end
