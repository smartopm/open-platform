class RenameFeedbackColumnToReview < ActiveRecord::Migration[6.0]
  def change
    rename_column :feedbacks, :feedback, :review
  end
end
