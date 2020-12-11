# frozen_string_literal: true

namespace :community_support do
  desc 'Update community support for Nkwashi'
  task update_nkwashi: :environment do
    puts 'Updating Nkwashi community support contacts...'
    support_email = [
      { email: 'support@doublegdp.com', category: 'customer_care' },
      { email: 'nkwashi-sales@doublegdp.com', category: 'sales' },
    ]

    support_number = [
      { phone_number: '+260 966 194383', category: 'sales' },
      { phone_number: '+260 760 635024', category: 'sales' },
      { phone_number: '+260 976 261199', category: 'customer_care' },
      { phone_number: '+260 974 624243', category: 'customer_care' },
    ]

    support_whatsapp = [{ whatsapp: '+260 974 624243', category: 'customer_care' }]

    nkwashi_comm = Community.find_by(name: 'Nkwashi')
    nkwashi_comm.update!(
      support_email: support_email,
      support_number: support_number,
      support_whatsapp: support_whatsapp,
    )
    puts 'Done!'
  end
end
