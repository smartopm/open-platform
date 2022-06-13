class AddStatusToAttachments < ActiveRecord::Migration[6.1]
  def change
    add_column :active_storage_attachments, :status, :integer, default: 0
  end
end
