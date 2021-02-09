class AddCommunityReferenceToWalletTransaction < ActiveRecord::Migration[6.0]
  def change
    nkwashi_community = Community.find_by(name: "Nkwashi")
    add_reference :wallet_transactions, :community, type: :uuid, null: false, foreign_key: true, default: nkwashi_community.id
  end
end
