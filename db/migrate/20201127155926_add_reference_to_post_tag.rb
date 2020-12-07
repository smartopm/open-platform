class AddReferenceToPostTag < ActiveRecord::Migration[6.0]
  def change
    add_reference :post_tags, :community, type: :uuid, index: true, foreign_key: true
  end
end