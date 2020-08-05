class AddIdColumnToDiscussionUsers < ActiveRecord::Migration[6.0]
    def change
        add_column :discussion_users, :id, :primary_key
    end
end