class AddSupportedLanguagesToCommunity < ActiveRecord::Migration[6.1]
  def change
    add_column :communities, :supported_languages, :json
  end
end
