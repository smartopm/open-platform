class CreateDiscussions < ActiveRecord::Migration[6.0]
  def change
    create_table :discussions, id: :uuid do |t|
      t.references :community, null: false, type: :uuid, foreign_key: true
      t.references :user, null: false, type: :uuid, foreign_key: true
      t.text :description
      t.string :title
      t.string :post_id
    end
  end
end
