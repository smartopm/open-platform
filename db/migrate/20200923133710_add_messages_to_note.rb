class AddMessagesToNote < ActiveRecord::Migration[6.0]
  def change
    add_reference :messages, :note, null: true, type: :uuid
  end
end
