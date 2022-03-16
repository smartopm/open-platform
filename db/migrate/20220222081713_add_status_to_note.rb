class AddStatusToNote < ActiveRecord::Migration[6.1]
  def change
    add_column :notes, :status, :integer, default: 0
  end
end
