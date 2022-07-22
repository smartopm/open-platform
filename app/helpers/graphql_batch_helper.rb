# frozen_string_literal: true

# GraphQLBatchHelper,
module GraphqlBatchHelper
  def batch_load(object, association_name)
    Loaders::AssociationLoader.for(object.class, association_name).load(object)
  end

  def attachment_load(record_type, attachment_name, object_id, type: :has_one_attached, **args)
    Loaders::ActiveStorageLoader.for(record_type, attachment_name, association_type: type, **args)
                                .load(object_id)
  end
end
