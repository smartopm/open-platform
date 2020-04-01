class AddUseridToMessages < ActiveRecord::Migration[6.0]
  def change
    add_column :messages, :user_id, :uuid
    add_column :messages, :receiver_id, :uuid
  end
end
