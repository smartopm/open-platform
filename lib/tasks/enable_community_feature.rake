# frozen_string_literal: true

desc 'enable a community feature'
task :enable_community_feature, %i[community_name feature] => :environment do |_t, args|
  unless args.community_name.present? && args.feature.present?
    abort('Community Name and Feature is required')
  end

  community = Community.find_by(name: args.community_name)
  abort('Community not found') unless community

  feature_name = args.feature

  abort('Feature already exists in community') if community.features.include?(feature_name)

  features_copy = community.features # assumption: features is stored as array list
  ActiveRecord::Base.transaction do
    puts "Total features before update:  #{features_copy.size}"

    features_copy[feature_name] = { features: [] }
    community.update!(features: features_copy)
  end

  abort('Sorry!! Nothing was updated') if community.features.size < features_copy.size

  puts "Done. Total features after update: #{community.features.size}"
end
