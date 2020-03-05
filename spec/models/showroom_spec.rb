# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Showroom, type: :model do
  # pending "add some examples to (or delete) #{__FILE__}"
  # create showroom entry
  Showroom.create(
    name: 'Olivier',
  )
  it 'should create a showroom entry' do

    expect(Showroom.all.count).to eql 1
  end

  it 'should also create an entry log entry' do

    expect(Showroom.all.count).to eql 1
  end

end
