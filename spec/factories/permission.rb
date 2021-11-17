# frozen_string_literal: true

FactoryBot.define do
  factory :permission do
    role
  end
end

#   Permission.create(role: role, module: valid_module, permissions: role_permissions )
