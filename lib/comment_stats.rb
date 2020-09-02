# check for new comments everyday, use created_at and compare with today
# loop through all discussions that have a subscription
# order it by user_id
# load discussions that had comments that day
# keep in mind of the community

# need number of comments for all discussions that a user commented on
# {
#     "count": 4,
#     "community": "Nkwashi",
#     "disc_id": "1ea0e106-6eba-49f2-9b92-4abbd982bf83"
#     }
require 'email_msg'

# message: There are [#] new comments on the discussion board you are following on the Nkwashi app
# template_id: d-a34dedfb684d446e849a02ccf480b985
class CommentsAlert
    def self.updated_discussions
        # check discussions that were commente.countd on before now
        discussions = Discussion.joins(:comments).where(["comments.created_at < ?", Time.now])
        discussion_ids = discussions.map { |disc| disc.id }
        discussion_ids
    end

    def self.todays_comments(user_id)
        comments = Comment.where(created_at: Date.today.all_day, user_id: user_id).count
    end

    def self.list_subscribers
        disc_ids = updated_discussions
        # check users subscribed to a discussion
        users = User.joins(:discussion_users).where(discussion_users: {discussion_id: disc_ids})
        users
    end

    def self.send_email_alert
        # template_id = 'd-a34dedfb684d446e849a02ccf480b985'
        a_template_id = 'd-bec0f1bd39f240d98a146faa4d7c5235'
        puts "sending nowwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
        users = list_subscribers
        users.each do |user|
            puts "sending to #{user.name}"
            # puts "sending to #{user.email}"
            EmailMsg.send_community_mail(user.email, user.name, 'Nkwashi', a_template_id)
        end
    end
end