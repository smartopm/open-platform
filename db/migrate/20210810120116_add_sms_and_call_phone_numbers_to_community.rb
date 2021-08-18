class AddSmsAndCallPhoneNumbersToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :sms_phone_numbers, :string, array: true, default: []
    add_column :communities, :emergency_call_number, :string
  end
end
