class RemoveUniqIndexUserIdLandParcelIdFromPaymentPlan < ActiveRecord::Migration[6.0]
  def change
    remove_index :payment_plans, column: %i[user_id land_parcel_id], name: :index_payment_plans_on_user_id_and_land_parcel_id
  end
end
