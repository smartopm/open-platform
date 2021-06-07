class IncludeSocialLinksToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :social_links, :json
  end
end
