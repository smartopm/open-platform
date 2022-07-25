# frozen_string_literal: true

module Loaders
  # active storage loader
  class ActiveStorageLoader < GraphQL::Batch::Loader
    attr_reader :record_type, :attachment_name, :association_type, :where, :order

    def initialize(record_type, attachment_name, association_type: :has_one_attached, **args)
      super()
      @record_type = record_type
      @attachment_name = attachment_name
      @association_type = association_type
      @where = args[:where]
      @order = args[:order]
    end

    # Find attachments and load records
    # * Using promises to preload data
    #
    # @param [Array]
    #
    # @return all_attachments [ActiveStorage::Attachment]
    def perform(record_ids)
      attachments = ActiveStorage::Attachment.includes(:blob).where(
        record_type: record_type, record_id: record_ids, name: attachment_name,
      ).where(where).order(order)
      load_records(record_ids, attachments)
    end

    def load_records(record_ids, attachments)
      if association_type.eql?(:has_many_attached)
        return load_has_many_records(record_ids, attachments)
      end

      load_has_one_records(record_ids, attachments)
    end

    # Load records for has one relationship
    #
    # @param [Array, ActiveStorage::Attachment]
    #
    # @return [ActiveStorage::Attachment]
    def load_has_one_records(record_ids, attachments)
      attachments.each do |attachment|
        fulfill(attachment.record_id, attachment)
      end

      record_ids.each { |id| fulfill(id, nil) unless fulfilled?(id) }
    end

    # Load records for has many relationship
    #
    # @param [Array, ActiveStorage::Attachment]
    #
    # @return [ActiveStorage::Attachment]
    def load_has_many_records(record_ids, attachments)
      record_ids.each do |record_id|
        fulfill(record_id, attachments.select { |attachment| attachment.record_id.eql?(record_id) })
      end
    end
  end
end
