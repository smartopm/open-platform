# frozen_string_literal: true

# example of Loading Labels.
# d = comma delimited with user id and label
# list =  CSV.new(d).read
#
# #format the list - set the indexes for labels and user_ids
# user_id_idx = 0
# label_idx = 5
#
# list.each do | user_label |
#   c_user = User.find(user_label[user_id_idx])
#   labl = c_user.community.labels.find_or_create_by(short_desc: user_label[label_idx])
#   c_user.labels<<labl unless c_user.labels.exists?(labl.id)
# end
class Label < ApplicationRecord
  belongs_to :community
  has_many :user_labels, dependent: :destroy
  has_many :users, through: :user_labels
  has_many :campaign_labels, dependent: :destroy
  has_many :campaigns, through: :campaign_labels

  def self.with_users(com, limit, offset)
    Label.find_by_sql(["SELECT labels.id, labels.short_desc, labels.color, COUNT(*) AS user_count
                FROM user_labels INNER JOIN labels ON user_labels.label_id = labels.id
                WHERE labels.community_id=?
                GROUP BY labels.id, labels.short_desc, labels.color LIMIT ? OFFSET ? "] + [com, limit, offset])
  end
end
