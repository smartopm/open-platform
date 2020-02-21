class CreateFeedbacks < ActiveRecord::Migration[6.0]
  def change
    create_table :feedbacks, id: :uuid do |t|
      t.string :userId
      t.boolean :like
      t.datetime :date
      t.string :name

      t.timestamps
    end
  end
end
