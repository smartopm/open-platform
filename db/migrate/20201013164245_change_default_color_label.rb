class ChangeDefaultColorLabel < ActiveRecord::Migration[6.0]
  def change
    change_column_default :labels, :color, '#f07030'
  end
end
