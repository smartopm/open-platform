class LandParcelAccount < ApplicationRecord
  belongs_to :land_parcel
  belongs_to :account
end
