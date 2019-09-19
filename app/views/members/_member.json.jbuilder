# frozen_string_literal: true

json.extract! member, :id, :type, :community_id, :user_id, :created_at, :updated_at
json.url member_url(member, format: :json)
