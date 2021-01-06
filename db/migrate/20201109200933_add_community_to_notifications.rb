class AddCommunityToNotifications < ActiveRecord::Migration[6.0]
  def change
    add_reference :notifications, :community, type: :uuid, index: true, foreign_key: true
  end
end
