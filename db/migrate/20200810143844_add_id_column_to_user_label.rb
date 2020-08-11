class AddIdColumnToUserLabel < ActiveRecord::Migration[6.0]
  def change
    enable_extension 'uuid-ossp'
    enable_extension 'pgcrypto'
    add_column :user_labels, :id, :uuid, primary_key: true, default: -> { "gen_random_uuid()" }
  end
end
