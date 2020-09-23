class CreateActivityPoints < ActiveRecord::Migration[6.0]
  def change
    create_table :activity_points, id: :uuid do |t|
      t.integer :article, default: 0
      t.integer :comment, default: 0
      t.integer :login, default: 0
      t.integer :referral, default: 0
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
