# frozen_string_literal: true

# Discussion users ==> user ==> discussion
class LandParcelAccount < ApplicationRecord
  belongs_to :user, dependent: :destroy
  belongs_to :discussion, dependent: :destroy
end
