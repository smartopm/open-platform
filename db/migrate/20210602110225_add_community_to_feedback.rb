class AddCommunityToFeedback < ActiveRecord::Migration[6.0]
  def change
    add_reference :feedbacks, :community, type: :uuid, index: true, foreign_key: true

    Feedback.find_each do |f|
      f.update!(community_id: f.user.community.id)
    end
    
  end
end
