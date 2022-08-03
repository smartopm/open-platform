class AddStatusToProcesses < ActiveRecord::Migration[6.1]
  def change
    add_column :processes, :status, :integer, default: 0
  end
end
