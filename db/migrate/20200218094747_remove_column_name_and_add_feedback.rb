class RemoveColumnNameAndAddFeedback < ActiveRecord::Migration[6.0]
  def change
    rename_column :feedbacks, :name, :feedback
  end
end
