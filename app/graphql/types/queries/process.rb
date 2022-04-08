# frozen_string_literal: true

# Processes queries
module Types::Queries::Process
  extend ActiveSupport::Concern

  included do
    field :process_templates, [Types::ProcessType], null: false do
      description 'Returns a list of process templates'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end
  def process_templates(limit: 50, offset: 0)
    unless permitted?(module: :process, permission: :can_view_process_templates)
      raise GraphQL::ExecutionError,
            I18n.t('errors.unauthorized')
    end

    context[:site_community]
      .processes
      .includes(:note_list, :form)
      .offset(offset).limit(limit)
  end
end
