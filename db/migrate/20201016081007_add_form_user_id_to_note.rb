class AddFormUserIdToNote < ActiveRecord::Migration[6.0]
  def change
    add_reference :notes, :form_user, type: :uuid, null: true, foreign_key: true
  end
end
