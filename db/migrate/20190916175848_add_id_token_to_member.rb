class AddIdTokenToMember < ActiveRecord::Migration[6.0]
  def change
    add_column :members, :id_token, :string
  end
end
