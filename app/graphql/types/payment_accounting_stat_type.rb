# frozen_string_literal: true

module Types
  # PaymentAccountingStatType
  class PaymentAccountingStatType < Types::BaseObject
    field :no_of_days, String, null: true
    field :cash, Integer, null: true
    field :mobile_money, Integer, null: true
    field :bank_transfer, Integer, null: true
    field :eft, Integer, null: true
    field :pos, Integer, null: true
  end
end
