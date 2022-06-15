# frozen_string_literal: true

module Labels
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
    has_many :users, class_name: 'Users::User', through: :user_labels
    has_many :campaign_labels, dependent: :destroy
    has_many :campaigns, through: :campaign_labels

    default_scope { where.not(status: 'deleted') }

    # Labels with associated users count.
    #
    # @param community_id [String]
    # @param limit [Integer]
    # @param offset [Integer]
    #
    # @return [Array]
    # rubocop:disable Metrics/MethodLength
    def self.with_users_count(community_id, limit, offset)
      sql = "
        SELECT
          l.id,
          short_desc,
          color,
          description,
          grouping_name,
          COUNT(ul.id) AS user_count
        FROM labels l
        LEFT JOIN user_labels ul ON l.id = ul.label_id
        WHERE l.community_id = ? AND l.status <> 'deleted'
        GROUP BY l.id, l.short_desc, l.color, l.description
        ORDER BY max(l.created_at) desc LIMIT ? OFFSET ?
      "
      Label.find_by_sql([sql, community_id, limit, offset])
    end
    # rubocop:enable Metrics/MethodLength
  end
end
