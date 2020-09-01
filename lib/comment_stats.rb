# check for new comments everyday, use created_at and compare with today
# loop through all discussions that have a subscription
# order it by user_id
# load discussions that had comments that day
# 

class Comments
    def self.updated_discussions
        # check discussions that were commented on before now
        discussions = Discussion.joins(:comments).where(["comments.created_at < ?", Time.now])
        discussions 
    end

    def self.subscribers
        # check users subscribed to a discussion
        
    end
end