class AddLatestSubstatusIdToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :latest_substatus_id, :uuid
  end
end