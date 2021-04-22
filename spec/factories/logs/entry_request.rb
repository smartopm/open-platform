# frozen_string_literal: true

FactoryBot.define do
  factory :entry_request, class: 'Logs::EntryRequest' do
    user
    community
    name { 'Joe Entry' }

    factory :pending_entry_request do
      granted_state { Logs::EntryRequest::GRANT_STATE.index('Pending') }
    end

    factory :granted_entry_request do
      granted_state { Logs::EntryRequest::GRANT_STATE.index('Granted') }
      grantor { user }
    end
  end
end
