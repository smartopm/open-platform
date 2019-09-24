module Types
  class MemberType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false
    field :member_type, String, null: true
  end
end
