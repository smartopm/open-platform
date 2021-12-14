class AddGaCodeToCommunity < ActiveRecord::Migration[6.1]
  def change
    add_column :communities, :ga_id, :string
  end
end
