class CreateContactInfos < ActiveRecord::Migration[6.0]
  def change
    create_table :contact_infos, id: :uuid do |t|
      t.string :contact_type
      t.string :info
      t.references :user, null: false, type: :uuid, foreign_key: true

      t.timestamps
    end
  end
end
