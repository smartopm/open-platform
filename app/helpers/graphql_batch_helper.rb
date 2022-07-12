# frozen_string_literal: true

# GraphQLBatchHelper,
module GraphqlBatchHelper
  def batch_load(object, field)
    Loaders::AssociationLoader.for(object.class, field).load(object)
  end
end
