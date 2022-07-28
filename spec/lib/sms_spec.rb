# frozen_string_literal: true

require 'rails_helper'
require 'sms'

describe Sms do
  let(:community) do
    create(:community, support_whatsapp: [{ category: 'communication', whatsapp: '912223334449' }])
  end

  describe '#from' do
    context 'when community have support whatsapp category communication' do
      it 'returns whats app number when form method is called' do
        expect(Sms.from(community)).to eql '912223334449'
      end
    end

    context 'when community does not have support whatsapp category communication' do
      before { community.update(support_whatsapp: nil) }

      it 'form method returns nil' do
        expect(Sms.from(community)).to eql nil
      end
    end
  end
end
