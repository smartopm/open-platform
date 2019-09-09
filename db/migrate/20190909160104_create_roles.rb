class CreateRoles < ActiveRecord::Migration[6.0]
  def change
    create_table :roles, id: :uuid do |t|
      t.uuid :community_id
      t.string :name
      t.string :description

      t.timestamps
    end
  end
end
