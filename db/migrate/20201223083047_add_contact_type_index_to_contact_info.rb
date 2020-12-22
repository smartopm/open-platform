class AddContactTypeIndexToContactInfo < ActiveRecord::Migration[6.0]
  def change
    add_index :contact_infos, [:contact_type, :user_id], unique: true
  end
end
