class AddColumnsForLeadTimeline < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :capex_amount, :string
    add_column :users, :jobs_created, :string
    add_column :users, :jobs_timeline, :string
    add_column :users, :kick_off_date, :datetime
    add_column :users, :investment_size, :string
    add_column :users, :investment_timeline, :string
    add_column :users, :decision_timeline, :string
  end
end
