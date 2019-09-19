# frozen_string_literal: true

# A Member passthrough table tying Users to Communities
class Member < ApplicationRecord
  belongs_to :community
  belongs_to :user
  has_many :activity_logs, dependent: :destroy

  def self.lookup_by_id_card_token(token)
    find_by(id: token)
  end

  def id_card_token
    # May want to do more to secure this in the future with some extra token
    self[:id]
  end
end
