# frozen_string_literal: true

module Labels
  # Campaign Label
  class CampaignLabel < ApplicationRecord
    belongs_to :campaign
    belongs_to :label
  end
end
