class AddIndexOnEmailTemplate < ActiveRecord::Migration[6.0]
  def change
    add_index :email_templates, :name, unique: true
  end
end
