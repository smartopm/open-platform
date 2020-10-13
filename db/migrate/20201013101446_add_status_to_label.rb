class AddStatusToLabel < ActiveRecord::Migration[6.0]
  def change
    add_column :labels, :status, :string, default: "active"
  end
end
