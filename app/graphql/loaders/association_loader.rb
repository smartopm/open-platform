# frozen_string_literal: true

module Loaders
  # Association loader
  class AssociationLoader < GraphQL::Batch::Loader
    attr_reader :model, :association_name

    def self.validate(model, association_name)
      new(model, association_name)
      nil
    end

    def initialize(model, association_name)
      super()
      @model = model
      @association_name = association_name
      validate
    end

    def load(record)
      unless record.is_a?(model)
        raise TypeError, "#{model} loader can't load association for #{record.class}"
      end
      return Promise.resolve(read_association(record)) if association_loaded?(record)

      super
    end

    # We want to load the associations on all records, even if they have the same id
    def cache_key(record)
      record.object_id
    end

    def perform(records)
      preload_association(records)
      records.each { |record| fulfill(record, read_association(record)) }
    end

    private

    def validate
      return if model.reflect_on_association(association_name)

      raise ArgumentError, "No association #{association_name} on #{model}"
    end

    def preload_association(records)
      ::ActiveRecord::Associations::Preloader.new.preload(records, association_name)
    end

    def read_association(record)
      record.public_send(association_name)
    end

    def association_loaded?(record)
      record.association(association_name).loaded?
    end
  end
end
