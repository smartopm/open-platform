class CreateNotes < ActiveRecord::Migration[6.0]
  def change
    create_table :notes, id: :uuid do |t|
      t.uuid :user_id
      t.uuid :author_id
      t.text :body

      t.timestamps
    end
  end
end
