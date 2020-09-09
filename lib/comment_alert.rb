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
    comm = Community.find_by(name: community_name)

    return if comm.nil?

    discussions = comm.discussions.by_commented_today
    discussion_ids = discussions.pluck(:id)
    {
      discussion_ids: discussion_ids,
      templates: comm.templates,
    }
  end

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def self.send_email_alert(community_name)
    return if Rails.env.test?

    data = updated_discussions(community_name)
    template_id = data[:templates]['discussion_template_id']
    discussion_ids = data[:discussion_ids]
    users = Discussion.by_subscribers(discussion_ids)
    users.each do |user|
      count = Comment.created_today.by_discussion(discussion_ids, user).count
      discussions = user.discussions.where(id: discussion_ids)
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
  # rubocop:enable Metrics/AbcSize
end
