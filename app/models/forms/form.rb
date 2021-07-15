# frozen_string_literal: true

module Forms
  # Form Record
  class Form < ApplicationRecord
    include FormRecordsDeletable

    belongs_to :community

    has_many :form_properties, dependent: :destroy
    has_many :form_users, dependent: :destroy

    validates :name, presence: true, uniqueness: true

    after_create :update_grouping_id

    default_scope { where.not(status: 2) }
    enum status: { draft: 0, published: 1, deleted: 2 }

    def has_entries?
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

    private

    def update_grouping_id
      update(grouping_id: id)
    end
  end
end
