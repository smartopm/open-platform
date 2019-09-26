# frozen_string_literal: true

# GraphQL Controller for all queries and mutations
class GraphqlController < ApplicationController
  def execute
    variables = ensure_hash(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]
    result = DoubleGdpSchema.execute(query, variables: variables, context: getContext(request),
                                            operation_name: operation_name)
    render json: result
  rescue StandardError => e
    raise e unless Rails.env.development?

    handle_error_in_development e
  end

  private

  def getContext(request)
    if request.headers['X-Member-ID']
      member = Member.find(request.headers['X-Member-ID'])
    end
    {
      # Query context goes here, for example:
      current_user: current_user,
      current_member: member,
    }
  end

  # Handle form data, JSON body, or a blank value
  def ensure_hash(ambiguous_param)
    case ambiguous_param
    when String
      handle_string_param(ambiguous_param)
    when Hash, ActionController::Parameters
      ambiguous_param
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
    end
  end

  def handle_string_param(str_param)
    if str_param.present?
      ensure_hash(JSON.parse(str_param))
    else
      {}
    end
  end

  def handle_error_in_development(err)
    logger.error err.message
    logger.error err.backtrace.join("\n")

    render json: { error: { message: err.message, backtrace: err.backtrace }, data: {} },
           status: :internal_server_error
  end
end
