# frozen_string_literal: true

# Overridng ActiceStorage controller
class ActiveStorage::BlobsController < ActiveStorage::BaseController
  include ActiveStorage::SetBlob
  include Authorizable

  def show
    if check_auth
      redirect_to @blob.service_url(disposition: params[:disposition])
    else
      redirect_to '/'
    end
  end

  # def execute
  #   variables = prep_variables(params[:variables])
  #   query = params[:query]
  #   operation_name = params[:operationName]

  #   result = DoubleGdpSchema.execute(query,
  #                                    variables: variables,
  #                                    context: auth_context(request),
  #                                    operation_name: operation_name)
  #   render json: result
  # rescue StandardError => e
  #   handle_errors(e)
  # end

  private

  # def handle_errors(err)
  #   raise err unless Rails.env.development?

  #   handle_error_in_development err
  # end

  def check_auth
    auth = auth_context(request)
    auth[:current_user].present?
  end

  # def auth_context(request)
  #   token = bearer_token(request)
  #   return { site_community: @site_community } unless token

  #   user = @site_community.users.find_via_auth_token(token, @site_community)

  #   log_active_user(user)
  #   {
  #     current_user: user,
  #     site_community: @site_community,
  #   }
  # end

  # def bearer_token(request)
  #   pattern = /^Bearer /
  #   header  = request.headers['Authorization']
  #   header.gsub(pattern, '') if header&.match(pattern)
  # end

  # def prep_variables(variables)
  #   ensure_hash(variables)
  # end

  # def log_active_user(user)
  #   cache_key = log_cache_key(user)
  #   cached = Rails.cache.read(cache_key)
  #   if cached
  #     return if Time.zone.at(cached) > Time.zone.now
  #   end

  #   EventLog.log_user_activity_daily(user)
  #   Rails.cache.write(cache_key, 8.hours.from_now.to_i, expires_in: 8.hours)
  # end

  # def log_cache_key(user)
  #   "us-#{user.id}"
  # end

  # # Handle form data, JSON body, or a blank value
  # def ensure_hash(ambiguous_param)
  #   case ambiguous_param
  #   when String
  #     handle_string_param(ambiguous_param)
  #   when Hash, ActionController::Parameters
  #     nil_empty(ambiguous_param)
  #   when nil
  #     {}
  #   else
  #     raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
  #   end
  # end

  # def handle_string_param(str_param)
  #   if str_param.present?
  #     ensure_hash(JSON.parse(str_param))
  #   else
  #     {}
  #   end
  # end

  # def nil_empty(params)
  #   params.transform_values do |v|
  #     if v.is_a?(String) && v.empty?
  #       nil
  #     else
  #       v
  #     end
  #   end
  # end

  # def handle_error_in_development(err)
  #   logger.error err.message
  #   logger.error err.backtrace.join("\n")

  #   render json: { error: { message: err.message, backtrace: err.backtrace }, data: {} },
  #          status: :internal_server_error
  # end
end
