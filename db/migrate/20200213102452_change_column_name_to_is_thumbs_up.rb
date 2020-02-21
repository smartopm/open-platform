class ChangeColumnNameToIsThumbsUp < ActiveRecord::Migration[6.0]
  def change
    rename_column :feedbacks, :like, :is_thumbs_up
  end
end
