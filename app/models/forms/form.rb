# frozen_string_literal: true

module Forms
  # Form Record
  class Form < ApplicationRecord
    include FormRecordsDeletable

    belongs_to :community

    has_many :form_properties, dependent: :destroy
    has_many :form_users, dependent: :destroy

    validates :name, presence: true, uniqueness: true
    validates :expires_at, presence: true

    default_scope { where.not(status: 2) }

    scope :by_user_type, lambda { |user|
      where('expires_at > ?', Time.zone.now).where(status: 1) if user.user_type != 'admin'
    }
    enum status: { draft: 0, published: 1, deleted: 2 }
  end
end
