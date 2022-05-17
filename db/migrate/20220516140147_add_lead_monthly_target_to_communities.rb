class AddLeadMonthlyTargetToCommunities < ActiveRecord::Migration[6.1]
  def change
    add_column :communities, :lead_monthly_targets, :json
  end
end
