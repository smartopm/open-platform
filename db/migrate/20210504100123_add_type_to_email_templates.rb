class AddTypeToEmailTemplates < ActiveRecord::Migration[6.0]
  def change
    add_column :email_templates, :tag, :string
  end
end
