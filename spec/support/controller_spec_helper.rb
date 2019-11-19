# Helper to help with authentication for GraphQL api
module ControllerSpecHelper
  def authenticate user
    token = user.auth_token
    request.env['HTTP_AUTHORIZATION'] = "Bearer #{token}"
  end
end
