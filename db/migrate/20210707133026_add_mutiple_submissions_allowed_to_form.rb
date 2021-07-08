class AddMutipleSubmissionsAllowedToForm < ActiveRecord::Migration[6.0]
  def change
    add_column :forms, :multiple_submissions_allowed, :boolean
  end
end
