class AddCommentsToNote < ActiveRecord::Migration[6.0]
  def change
    add_reference :comments, :note, null: true
  end
end
