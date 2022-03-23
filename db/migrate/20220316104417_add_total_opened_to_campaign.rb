class AddTotalOpenedToCampaign < ActiveRecord::Migration[6.1]
  def change
    add_column :campaigns, :total_opened, :integer, default: 0
    change_column_default(:campaigns, :total_clicked, from: nil, to: 0)
  end
end
