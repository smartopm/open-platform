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
#     "disc_id": "1ea0e106-6eba-49f2-9b92-4abbd982bf83",
#     "data": [array of discussions]
#     }
require 'email_msg'

# class helper to help send emails to doublegdp users for discussions they follow
class CommentsAlert
  def self.updated_discussions(community_name)
    # check discussions that were commented on today
    discussions = Community.find_by(name: community_name).discussions.by_commented_today
    discussion_ids = discussions.pluck(:id)
    discussion_ids
  end

  # rubocop:disable Metrics/MethodLength
  def self.send_email_alert(community_name)
    return if Rails.env.test?

    template_id = 'd-a34dedfb684d446e849a02ccf480b985'
    disc_ids = updated_discussions(community_name)
    users = Discussion.by_subscribers(disc_ids)
    users.each do |user|
      count = Comment.created_today.by_discussion(disc_ids, user).count
      discussions = user.discussions.where(id: disc_ids)
      data = {
        count: count,
        discussions: discussions,
        community: community_name,
        name: user.name,
      }
      EmailMsg.send_mail(user.email, template_id, data)
    end
  end
  # rubocop:enable Metrics/MethodLength
end
