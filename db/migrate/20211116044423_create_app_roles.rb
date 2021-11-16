class CreateAppRoles < ActiveRecord::Migration[6.1]
  def change
    create_table :roles, id: :uuid do |t|
      t.string :name
      t.references :community, null: true, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
