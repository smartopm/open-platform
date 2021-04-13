class AddDataToEmailTemplates < ActiveRecord::Migration[6.0]
  def change
    add_column :email_templates, :data, :json
  end
end
