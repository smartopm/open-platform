class AddTemplateVariablesColumnToEmailTemplates < ActiveRecord::Migration[6.0]
  def change
    add_column :email_templates, :template_variables, :json
  end
end
