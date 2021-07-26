# frozen_string_literal: true

module Forms
  # Form Record
  class Form < ApplicationRecord
    include FormRecordsDeletable

    belongs_to :community

    has_many :form_properties, dependent: :destroy
    has_many :form_users, dependent: :destroy

    validates :name, presence: true, uniqueness: { scope: :community_id }

    default_scope { where.not(status: 2) }

    scope :by_published, lambda { |user|
      self.published if user.user_type != 'admin'
    }

    enum status: { draft: 0, published: 1, deleted: 2, deprecated: 3 }

    def entries?
      form_users.present?
    end

    def duplicate(form_property_id)
      dup.tap do |new_form|
        form_properties.each do |property|
          next if property.id == form_property_id

          new_form.form_properties.push property.dup
        end
      end
    end

    def last_version
      Form.where(grouping_id: grouping_id)
          .order(:created_at).last.version_number
    end
  end
end
