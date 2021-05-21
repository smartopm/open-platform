# frozen_string_literal: true

FactoryBot.define do
  factory :transaction do
    source { 'cash' }
    status { 'accepted' }
    amount { 500 }
  end
end
