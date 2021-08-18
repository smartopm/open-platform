class AddUniqueIndexToSubscriptionPlans < ActiveRecord::Migration[6.0]
  def change
    add_index :subscription_plans, [:start_date, :end_date, :amount], unique: true
  end
end
