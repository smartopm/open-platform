# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Permission, type: :model do
  let!(:role) { create(:role, name: 'admin') }
  describe 'crud' do
    it 'should allow to create a role' do
      Permission.create(role: role, module: 'entry_request', permissions: %w[can_invite_guest])
      expect(Permission.all.length).to eql 1
    end
  end
  describe 'associations' do
    let!(:permission) do
      create(:permission, module: 'note',
                          role: role,
                          permissions: %w[can_create_note])
    end

    it { should belong_to(:role) }
  end
end
