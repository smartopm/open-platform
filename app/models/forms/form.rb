# frozen_string_literal: true

module Forms
  # Form Record
  class Form < ApplicationRecord
    include FormRecordsDeletable

    belongs_to :community

    has_many :form_properties, dependent: :destroy
    has_many :form_users, dependent: :destroy
    has_many :categories, dependent: :destroy

    validates :name, presence: true, uniqueness: { scope: :community_id }

    default_scope { where.not(status: 2) }

    scope :by_published, lambda { |user|
      published if user.user_type != 'admin'
    }

    enum status: { draft: 0, published: 1, deleted: 2, deprecated: 3 }

    def entries?
      form_users.present?
    end

    # Duplicates all categories and form properties associated with the form
    #
    # @param new_form [Forms::Form]
    # @param vals [Hash]
    # @param action [Symbol]
    #
    # @return [void]
    def duplicate(new_form, vals, action)
      duplicate_categories(new_form: new_form, form_categories: categories, vals: vals,
                           action: action)
    end

    def last_version
      Form.where(grouping_id: grouping_id)
          .order(:created_at).last.version_number
    end

    def report_an_issue?
      ['Report an Issue', 'Informar de un problema'].include?(name)
    end

    private

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # Clones each category and it's association with form and form property
    #
    # @param args [Hash]
    #
    # @return [void]
    def duplicate_categories(args = {})
      form_categories = args[:form_categories]
      vals = args[:vals]
      form_categories.each do |category|
        next if category.id.eql?(vals[:category_id]) && args[:action].eql?(:category_delete)

        new_category = category.dup
        new_category.form_property_id = args[:form_property]&.id
        if category.id.eql?(vals[:category_id]) && args[:action].eql?(:category_update)
          new_category.assign_attributes(vals.except(:category_id))
        end
        new_category.form_id = args[:new_form].id
        new_category.save!
        duplicate_properties(new_form: args[:new_form], new_category: new_category,
                             properties: category.form_properties, vals: vals,
                             action: args[:action])
      end
    end

    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # Clones each form property and it's association with form and category
    #
    # @param args [Hash]
    #
    # @return [void]
    def duplicate_properties(args = {})
      vals = args[:vals]
      args[:properties].each do |property|
        next if property.id.eql?(vals[:form_property_id]) && args[:action].eql?(:property_delete)

        new_property = property.dup
        if property.id.eql?(vals[:form_property_id]) && args[:action].eql?(:property_update)
          new_property.assign_attributes(vals.except(:form_property_id))
        end
        new_property.form_id = args[:new_form].id
        new_property.category_id = args[:new_category].id
        new_property.save!
      end
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
  end
end
