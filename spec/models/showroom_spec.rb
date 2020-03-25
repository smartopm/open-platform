# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Showroom, type: :model do
  # pending "add some examples to (or delete) #{__FILE__}"
  # create showroom entry
  it 'should create a showroom entry' do
    Showroom.create(
      name: 'Olivier',
    )
    expect(Showroom.all.count).to eql 1
  end
end
