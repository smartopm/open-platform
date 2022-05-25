class AddInvestmentDetailsToLeadLogs < ActiveRecord::Migration[6.1]
  def change
    add_column :lead_logs, :amount, :float, default: 0.0
    add_column :lead_logs, :deal_size, :float, default: 0.0
    add_column :lead_logs, :investment_target, :float, default: 0.0
  end
end
