# frozen_string_literal: true

# GraphQL Controller for all queries and mutations
class GraphqlController < ApplicationController
  def execute
    variables = prep_variables(params[:variables], request)
    query = params[:query]
    operation_name = params[:operationName]

    result = DoubleGdpSchema.execute(query, variables: variables, context: context,
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

  def context
    {
      current_user: current_user,
    }
  end

  def prep_variables(variables, request)
    vars = ensure_hash(variables)
    vars[:actingMemberId] = validate_acting_member_id(vars, request)
    vars
  end

  # Ensure that we always have the 'actingMemberId' ready
  # and that it's authenticated
  def validate_acting_member_id(variables, request)
    user = current_user
    member_id = variables[:actingMemberId] || request.headers['X-Member-ID']
    if user && member_id
      member = Member.find_by(id: member_id, user_id: user.id)
      return member.id if member
    end
    nil
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
