class CreateMessage < ActiveRecord::Migration[6.0]
  def change
    create_table :messages, id: :uuid do |t|
      t.string :receiver
      t.string :sender
      t.text :sms_content
      t.string :status

      t.timestamps

    end
  end
end
