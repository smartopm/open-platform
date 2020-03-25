class RenameSmsContentToMessage < ActiveRecord::Migration[6.0]
  def change
    rename_column :messages, :sms_content, :message
  end
end
