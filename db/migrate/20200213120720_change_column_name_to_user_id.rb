class ChangeColumnNameToUserId < ActiveRecord::Migration[6.0]
  def change
    rename_column :feedbacks, :userId, :user_id
  end
end
