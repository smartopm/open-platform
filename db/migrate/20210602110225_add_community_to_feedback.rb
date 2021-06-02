class AddCommunityToFeedback < ActiveRecord::Migration[6.0]
  def change
    add_reference :feedbacks, :community, type: :uuid, index: true, foreign_key: true
    # Nkwashi community has most of the feedback as of now 
    nkwashi_community = Community.find_by(name: "Nkwashi")
    Feedback.update_all(community_id: nkwashi_community.id)
  end
end
