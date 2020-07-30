# frozen_string_literal: true

# UserLabel
class CampaignLabel < ApplicationRecord
  belongs_to :campaign
  belongs_to :label
end
