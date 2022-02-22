class AddStatusToNote < ActiveRecord::Migration[6.1]
  def change
    add_column :notes, :status, :integer
  end
end
