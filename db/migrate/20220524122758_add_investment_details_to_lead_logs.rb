class AddInvestmentDetailsToLeadLogs < ActiveRecord::Migration[6.1]
  def change
    add_column :lead_logs, :amount, :decimal, precision: 11, scale: 2, default: 0
    add_column :lead_logs, :deal_size, :decimal, precision: 11, scale: 2, default: 0
    add_column :lead_logs, :investment_target, :decimal, precision: 11, scale: 2, default: 0
  end
end
