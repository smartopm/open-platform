class AddRequestColumnsToMember < ActiveRecord::Migration[6.0]
  def change
    add_column :members, :first_name, :string
    add_column :members, :last_name, :string
    add_column :members, :request_reason, :string
    add_column :members, :request_status, :string
    add_column :members, :request_vehicle, :string
  end
end
