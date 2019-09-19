class AddTypeToMember < ActiveRecord::Migration[6.0]
  def change
    add_column :members, :type, :string
  end
end
