class AddTotalOpenedToCampaign < ActiveRecord::Migration[6.1]
  def change
    add_column :campaigns, :total_opened, :integer
  end
end
