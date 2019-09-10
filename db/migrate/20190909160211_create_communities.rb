class CreateCommunities < ActiveRecord::Migration[6.0]
  def change
    create_table :communities, id: :uuid do |t|
      t.string :name
      t.string :google_domain

      t.timestamps
    end
  end
end
