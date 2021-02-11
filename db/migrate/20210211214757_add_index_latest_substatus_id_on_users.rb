class AddIndexLatestSubstatusIdOnUsers < ActiveRecord::Migration[6.0]
  def change
    add_index :users, :latest_substatus_id
  end
end
