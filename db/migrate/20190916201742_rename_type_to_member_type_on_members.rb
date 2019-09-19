class RenameTypeToMemberTypeOnMembers < ActiveRecord::Migration[6.0]
  def change
    rename_column :members, :type, :member_type
  end
end
