# frozen_string_literal: true

module Mutations
  module Helpers
    # Helper methods for form mutations
    module FormHelper
      # Duplicates form with new version number
      #
      # @param form [Forms::Form]
      # @param values [Hash]
      # @param action [Symbol]
      # @return new_form [Forms::Form]
      def duplicate_form(form, values, action)
        ActiveRecord::Base.transaction do
          new_form = new_form_attributes(form)

          if new_form.save!
            form.duplicate(new_form, values, action)
            update_linked_process(form, new_form)
            form.deprecated!
            new_form
          end
        end
      end

      private

      def new_form_attributes(form)
        last_version_number = form.last_version
        new_form = form.dup
        new_form.version_number = (last_version_number + 1)
        new_name = form.name.gsub(/\s(V)\d*/, '')
        new_form.name = "#{new_name} V#{last_version_number + 1}"
        new_form
      end

      def update_linked_process(form, new_form)
        process = form.process
        return unless process

        # Remove deprecated form association
        form.process = nil
        form.save
        # Set new form association
        process.update(form_id: new_form.id)
      end
    end
  end
end
