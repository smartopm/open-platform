# frozen_string_literal: true

module Mutations
  # Our BaseMutation Parent Class
  class BaseMutation < GraphQL::Schema::Mutation
    class MutationArgumentError < GraphQL::ExecutionError; end

    private

    def ensure_logged_in
      raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]
    end

    def check_params(rules, values)
      user_type = context[:current_user]&.user_type
      raise MutationArgumentError unless user_type

      rule_set = rules[user_type.to_sym]
      check_permitted(values, rule_set[:permit]) if rule_set[:permit]
      check_excepted(values, rule_set[:except]) if rule_set[:except]
    end

    def check_permitted(values, keys)
      values.each_pair do |key, _val|
        raise MutationArgumentError, 'Unauthorized Arguments' unless keys.include(key)
      end
    end

    def check_excepted(values, keys)
      keys.each do |key|
        raise MutationArgumentError, 'Unauthorized Arguments' if values.key?(key)
      end
    end

    def create_campaign_label(campaign, label)
      existing_label = Label.find_by(short_desc: label)
      return associate_campaign_label(campaign, existing_label) if existing_label.present?

      label = context[:site_community].labels.new(short_desc: label)
      return associate_campaign_label(campaign, label) if label.save!

      raise GraphQL::ExecutionError, label.errors.full_message
    end

    def associate_campaign_label(campaign, existing_label)
      CampaignLabel.create!(campaign_id: campaign.id, label_id: existing_label.id)
    end
  end
end
