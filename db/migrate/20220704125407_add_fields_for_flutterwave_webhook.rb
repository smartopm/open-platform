class AddFieldsForFlutterwaveWebhook < ActiveRecord::Migration[6.1]
  def change
    add_column :transaction_logs, :status, :integer, default: 0
    add_column :transaction_logs, :payment_link, :string 
    add_column :transaction_logs, :meta_data, :json
  end
end
