class AddSubmittedByToFormUser < ActiveRecord::Migration[6.1]
  def change
    add_column :form_users, :submitted_by_id, :uuid, optional: true, foreign_key: true
  end
end
