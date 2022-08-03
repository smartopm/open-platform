class ChangeShowroomColumnNameToUserId < ActiveRecord::Migration[6.1]
  def change
    rename_column :showrooms, :userId, :user_id
  end
end
