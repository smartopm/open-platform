class AddEntryRequestToInvite < ActiveRecord::Migration[6.1]
  def change
    add_reference :invites, :entry_request, type: :uuid, foreign_key: true
  end
end
