class AddStatusUpdatedByFieldToFormUser < ActiveRecord::Migration[6.0]
  def change
    add_reference :form_users, :status_updated_by, type: :uuid, foreign_key: { to_table: :users }
  end
end
