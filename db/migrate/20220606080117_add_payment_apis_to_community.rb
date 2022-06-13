class AddPaymentApisToCommunity < ActiveRecord::Migration[6.1]
  def change
    add_column :communities, :payment_keys, :json
  end
end
