class AddExpirationToMember < ActiveRecord::Migration[6.0]
  def change
    add_column :members, :expires_at, :datetime
  end
end
