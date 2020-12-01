class AddContactToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :support_number, :json
    add_column :communities, :support_email, :json
  end
end
