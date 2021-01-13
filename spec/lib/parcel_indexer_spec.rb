# frozen_string_literal: true

require 'parcel_indexer'

RSpec.describe ParcelIndexer do
  it 'should generate parcel no with default \'BASIC\' when type is not given' do
    id = ParcelIndexer.generate_parcel_no

    expect(id).to match(/BASIC-/)
  end

  it 'should generate parcel no when type is given' do
    id = ParcelIndexer.generate_parcel_no(parcel_type: 'standard')

    expect(id).to match(/STANDARD-/)
  end

  it 'should raise exception if type is not valid parcel type' do
    expect do
      ParcelIndexer.generate_parcel_no(parcel_type: 'unknown')
    end.to raise_error(StandardError)
  end
end
