class AddHasAgreedTermsToFormUser < ActiveRecord::Migration[6.1]
  def change
    add_column :form_users, :has_agreed_to_terms, :boolean
  end
end
