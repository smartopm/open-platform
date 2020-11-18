class AddCommunityToActionFlow < ActiveRecord::Migration[6.0]
  def change
    add_reference :action_flows, :community, type: :uuid, index: true, foreign_key: true

    nkwashi_community = Community.find_by(name: "Nkwashi")
    ActionFlow.update_all(community_id: nkwashi_community.id)
  end
end
