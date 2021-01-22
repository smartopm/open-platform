# frozen_string_literal: true

desc 'copy payment details from payments table to wallet transactions'
task copy_payments_to_transactions: :environment do
  Payment.all.each do |payment|
    attr = payment.attributes
    source = attr.delete('payment_type')
    status = attr.delete('payment_status')
    invoice_id = attr.delete('invoice_id')

    transaction_attr = attr.merge(source: source, destination: 'invoice', status: status)
    transaction = WalletTransaction.create(transaction_attr)

    PaymentInvoice.create(
      payment_id: payment.id, invoice_id: invoice_id, wallet_transaction_id: transaction.id,
    )
  end
end
