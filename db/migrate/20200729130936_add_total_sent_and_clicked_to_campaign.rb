class AddTotalSentAndClickedToCampaign < ActiveRecord::Migration[6.0]
  def change
    add_column :campaigns, :total_sent, :integer
    add_column :campaigns, :total_clicked, :integer
  end
end
