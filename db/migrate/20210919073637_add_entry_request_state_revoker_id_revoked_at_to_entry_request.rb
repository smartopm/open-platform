class AddEntryRequestStateRevokerIdRevokedAtToEntryRequest < ActiveRecord::Migration[6.0]
  def change
    add_column :entry_requests, :entry_request_state, :integer, default:0
    add_column :entry_requests, :revoker_id, :uuid
    add_column :entry_requests, :revoked_at, :datetime
  end
end
