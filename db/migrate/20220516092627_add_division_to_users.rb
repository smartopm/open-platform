class AddDivisionToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :division, :string
  end
end
