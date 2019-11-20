# frozen_string_literal: true

# GraphQL Controller for all queries and mutations
class GraphqlController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:execute]

  def execute
    variables = prep_variables(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]

    result = DoubleGdpSchema.execute(query,
                                     variables: variables,
                                     context: auth_context(request),
                                     operation_name: operation_name)
    render json: result
  rescue StandardError => e
    handle_errors(e)
  end

  private

  def handle_errors(err)
    raise err unless Rails.env.development?

    handle_error_in_development err
  end

  def auth_context(request)
    token = bearer_token(request)
    return nil unless token

    user = User.find_by(auth_token: token)
    {
      current_user: user,
    }
  end

  def bearer_token(request)
    pattern = /^Bearer /
    header  = request.headers['Authorization']
    header.gsub(pattern, '') if header&.match(pattern)
  end

  def prep_variables(variables)
    ensure_hash(variables)
  end

  # Handle form data, JSON body, or a blank value
  def ensure_hash(ambiguous_param)
    case ambiguous_param
    when String
      handle_string_param(ambiguous_param)
    when Hash, ActionController::Parameters
      nil_empty(ambiguous_param)
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

  def nil_empty(params)
    params.transform_values do |v|
      if v.is_a?(String) && v.empty?
        nil
      else
        v
      end
    end
  end

  def handle_error_in_development(err)
    logger.error err.message
    logger.error err.backtrace.join("\n")

    render json: { error: { message: err.message, backtrace: err.backtrace }, data: {} },
           status: :internal_server_error
  end
end
