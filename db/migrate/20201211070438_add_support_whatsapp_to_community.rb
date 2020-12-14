class AddSupportWhatsappToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :support_whatsapp, :json
  end
end
