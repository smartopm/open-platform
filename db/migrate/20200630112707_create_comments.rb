class CreateComments < ActiveRecord::Migration[6.0]
  def change
    create_table :comments, id: :uuid do |t|
      t.string :post_id
      t.uuid :user_id
      t.text :content

      t.timestamps
    end
  end
end
