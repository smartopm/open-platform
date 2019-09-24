module Types
  class QueryType < Types::BaseObject
    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    # First describe the field signature:
    field :member, MemberType, null: true do
      description "Find a member by ID"
      argument :id, ID, required: true
    end

    # Then provide an implementation:
    def member(id:)
      Member.find(id)
    end

  end
end
