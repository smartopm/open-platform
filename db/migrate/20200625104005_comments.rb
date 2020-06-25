class Comments < ActiveRecord::Migration[6.0]
    def change
      create_table :comments do |t|
        t.uuid :post_id
        t.uuid :community_id
        t.uuid :user_id
        t.text :comment
   
        t.timestamps
      end
    end
  end