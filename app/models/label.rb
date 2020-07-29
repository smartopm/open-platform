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
end
