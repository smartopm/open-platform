# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Labels::Label, type: :model do
  let!(:label) { create(:label, short_desc: 'Test') }
  let(:community) { label.community }
  let(:other_community) { create(:community) }
  let(:scoped_label) do
    create(:label, community: community, short_desc: 'India', grouping_name: 'Division')
  end
  let(:scoped_label_in_different_community) do
    create(:label, community: other_community, short_desc: 'India', grouping_name: 'Division')
  end
  let!(:current_user1) { create(:user, community: community) }
  let!(:current_user2) { create(:user, community: community, role: current_user1.role) }
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:short_desc).of_type(:string) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:grouping_name).of_type(:string) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to have_many(:user_labels).dependent(:destroy) }
    it { is_expected.to have_many(:users).through(:user_labels) }
    it { is_expected.to have_many(:campaign_labels).dependent(:destroy) }
    it { is_expected.to have_many(:campaigns).through(:campaign_labels) }
  end

  describe 'validations' do
    it {
      is_expected.to validate_uniqueness_of(:short_desc)
        .scoped_to(:grouping_name, :community_id)
    }

    context 'when label without group already exist' do
      it 'raises validation error' do
        expect do
          described_class.create!(community: community, short_desc: 'Test')
        end.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    context 'when label of same group already exist' do
      before { scoped_label }

      it 'raises validation error' do
        expect do
          described_class.create!(community: community,
                                  short_desc: 'India',
                                  grouping_name: 'Division')
        end.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    context 'when label is created in different community' do
      before { scoped_label }

      it 'creates two labels in respective communites' do
        expect(described_class.create!(community: other_community,
                                       short_desc: 'India',
                                       grouping_name: 'Division')).to_not be_nil
      end
    end
  end

  it 'has a valid factory' do
    expect(FactoryBot.build(:label)).to be_valid
  end

  it 'can have 1 user' do
    label.users << current_user1
    expect(label.users.length).to eql 1
    expect(label.users[0].id).to eql current_user1.id
  end

  it 'can have 2 users' do
    label.users << current_user1
    label.users << current_user2
    expect(label.users.length).to eql 2
    expect(label.users.find(current_user1.id)).to eql current_user1
    expect(label.users.find(current_user2.id)).to eql current_user2
    expect(current_user1.labels.pluck(:id)).to include(label.id)
    expect(current_user2.labels.pluck(:id)).to include(label.id)
    expect(current_user1.labels.length).to eql 4
    expect(current_user2.labels.length).to eql 4
  end

  it 'label have a community' do
    label.users << current_user1
    label.users << current_user2
    expect(label.community.labels.length).to eql 4
    expect(label.community.labels[0].users.find(current_user1.id)).to eql current_user1
    expect(label.community.labels[0].users.find(current_user2.id)).to eql current_user2
  end
end
