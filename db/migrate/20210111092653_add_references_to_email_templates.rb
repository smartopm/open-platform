class AddReferencesToEmailTemplates < ActiveRecord::Migration[6.0]
  def change
    add_reference :email_templates, :templatable, type: :uuid, polymorphic: true
  end
end
