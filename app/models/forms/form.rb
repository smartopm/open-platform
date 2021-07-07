# frozen_string_literal: true

module Forms
  # Form Record
  class Form < ApplicationRecord
    include FormRecordsDeletable

    belongs_to :community

    has_many :form_properties, dependent: :destroy
    has_many :form_users, dependent: :destroy

    validates :name, presence: true, uniqueness: true

    default_scope { where.not(status: 2) }
    enum status: { draft: 0, published: 1, deleted: 2 }
  end
end
