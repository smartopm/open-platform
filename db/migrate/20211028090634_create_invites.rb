class CreateInvites < ActiveRecord::Migration[6.1]
  def change
    create_table :invites, id: :uuid do |t|
      t.uuid :host_id
      t.uuid :guest_id
      t.datetime :revoked_at

      t.timestamps
    end
    add_index :invites, [:host_id, :guest_id], :unique => true
  end
end
