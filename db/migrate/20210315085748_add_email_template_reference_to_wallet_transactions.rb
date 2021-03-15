class AddEmailTemplateReferenceToWalletTransactions < ActiveRecord::Migration[6.0]
  def change
    add_reference :wallet_transactions, :email_template, null: true, type: :uuid
  end
end
