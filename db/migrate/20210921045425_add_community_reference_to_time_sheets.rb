class AddCommunityReferenceToTimeSheets < ActiveRecord::Migration[6.0]
  def change
    add_reference :time_sheets, :community, type: :uuid, foreign_key: true
  end
end
