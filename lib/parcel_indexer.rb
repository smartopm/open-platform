# frozen_string_literal: true

require 'securerandom'

# class helper to handle indexing of parcels by generaing consistent parcel number
class ParcelIndexer
  class UninitializedError < StandardError; end
  class ParcelIndexerError < StandardError; end

  PARCEL_TYPE = {
    basic: 'basic',
    starter: 'starter',
    standard: 'standard',
    premium: 'premium',
  }.freeze

  # public interface to handle generation of IDs
  def self.generate_parcel_no(parcel_type: 'basic')
    unless PARCEL_TYPE.key?(parcel_type.downcase.to_sym)
      raise ParcelIndexerError "Invalid Parcel Type. Expected one of #{PARCEL_TYPE.keys}"
    end

    generate_id(type: parcel_type.downcase.to_sym)
  end

  def self.generate_id(type:)
    prefix = prefix(key: type)

    id = SecureRandom.random_number(10_000...99_999) # 5 digit number

    "#{prefix}#{id}"
  end

  def self.prefix(key:)
    seperator = '-'

    "#{PARCEL_TYPE[key].upcase}#{seperator}"
  end
end
