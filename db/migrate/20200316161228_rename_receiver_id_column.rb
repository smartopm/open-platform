class RenameReceiverIdColumn < ActiveRecord::Migration[6.0]
  def change
    rename_column :messages, :receiver_id, :sender_id
    remove_column :messages, :sender
  end
end
