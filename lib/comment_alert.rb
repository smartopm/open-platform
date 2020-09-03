# frozen_string_literal: true

# check for new comments everyday, use created_at and compare with today
# loop through all discussions that have a subscription
# load discussions that had comments that day
# keep in mind of the community
# get number of comments on discussions the user follows
# need number of comments for all discussions that a user commented on
# {
#     "count": 4,
#     "community": "Nkwashi",
#     "disc_id": "1ea0e106-6eba-49f2-9b92-4abbd982bf83"
#     }
require 'email_msg'

# class helper to help send emails to doublegdp users for discussions they follow
class CommentsAlert
  def self.updated_discussions(community_name)
    # check discussions that were commented on today
    discussions = Community.find_by(name: community_name).discussions.commented_today
    discussion_ids = discussions.pluck(:id)
    discussion_ids
  end

  def self.list_subscribers(community_name)
    disc_ids = updated_discussions(community_name)
    # check users subscribed to updated discussions
    users = User.joins(:discussion_users).where(discussion_users: { discussion_id: disc_ids })
    users
  end

  def self.send_email_alert(community_name)
    return if Rails.env.test?

    template_id = 'd-a34dedfb684d446e849a02ccf480b985'
    users = list_subscribers(community_name)
    users.each do |user|
      disc_id = Discussion.pluck(:id)
      count = Comment.where(discussion_id: disc_id, user_id: user).count
      # Find a way of getting the discussion_id
      data = { 'count' => count, 'disc_id' => '' }
      EmailMsg.send_community_mail(user.email, user.name, community_name, template_id, data)
    end
  end
end
