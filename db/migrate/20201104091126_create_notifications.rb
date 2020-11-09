class CreateNotifications < ActiveRecord::Migration[6.0]
  def change
    create_table :notifications, id: :uuid do |t|
      t.datetime :seen_at
      t.references :notifable, type: :uuid, polymorphic: true
      t.belongs_to :user, type: :uuid, null: false, foreign_key: true
      
      t.timestamps
    end
  end
end
