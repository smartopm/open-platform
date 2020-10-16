# frozen_string_literal: true

namespace :user_labels do
  desc 'Add user labels'
  task :add, %i[label_name] => :environment do |_t, args|
    puts "adding #{args.label_name} label to users..."
    community = Community.find_by(name: 'Nkwashi')
    label = community.labels.find_by(short_desc: args.label_name).presence ||
            community.labels.create!(short_desc: args.label_name)

    User.find_each do |user|
      user.user_labels.create!(label_id: label.id)
    rescue ActiveRecord::RecordNotUnique
      next
    end
  end
end
