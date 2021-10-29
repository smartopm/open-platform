class AddVerificationStateToEntryRequest < ActiveRecord::Migration[6.1]
  def change
    add_column :entry_requests, :status, :integer, default:0
  end
end
