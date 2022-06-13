class AddHasTermsAndConditionsToForms < ActiveRecord::Migration[6.1]
  def change
    add_column :forms, :has_terms_and_conditions, :boolean
  end
end
