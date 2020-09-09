# frozen_string_literal: true

desc 'update community with current template_ids'
task update_community_templates: :environment do
  puts 'updating community'
  comm = Community.find_by(name: 'Nkwashi')
  template = {
    discussion_template_id: 'd-a34dedfb684d446e849a02ccf480b985',
    campaign_template_id: 'd-8f92d03a6f5c4e16a976ab47b03298a1',
    welcome_template_id: 'd-bec0f1bd39f240d98a146faa4d7c5235',
  }
  comm.update(templates: template)
end
