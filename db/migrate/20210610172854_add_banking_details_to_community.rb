class AddBankingDetailsToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :banking_details, :json
  end
end
