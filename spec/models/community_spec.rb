# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Community, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:name).of_type(:string) }
    it { is_expected.to have_db_column(:google_domain).of_type(:string) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:slug).of_type(:string) }
    it { is_expected.to have_db_column(:logo_url).of_type(:string) }
    it { is_expected.to have_db_column(:slack_webhook_url).of_type(:string) }
    it { is_expected.to have_db_column(:timezone).of_type(:string) }
    it { is_expected.to have_db_column(:default_users).of_type(:string) }
    it { is_expected.to have_db_column(:templates).of_type(:json) }
    it { is_expected.to have_db_column(:hostname).of_type(:string) }
    it { is_expected.to have_db_column(:support_number).of_type(:json) }
    it { is_expected.to have_db_column(:support_email).of_type(:json) }
    it { is_expected.to have_db_column(:support_whatsapp).of_type(:json) }
    it { is_expected.to have_db_column(:currency).of_type(:string) }
    it { is_expected.to have_db_column(:locale).of_type(:string) }
    it { is_expected.to have_db_column(:tagline).of_type(:string) }
    it { is_expected.to have_db_column(:language).of_type(:string) }
    it { is_expected.to have_db_column(:wp_link).of_type(:string) }
    it { is_expected.to have_db_column(:features).of_type(:json) }
    it { is_expected.to have_db_column(:theme_colors).of_type(:json) }
    it { is_expected.to have_db_column(:security_manager).of_type(:string) }
    it { is_expected.to have_db_column(:social_links).of_type(:json) }
    it { is_expected.to have_db_column(:banking_details).of_type(:json) }
    it { is_expected.to have_db_column(:community_required_fields).of_type(:json) }
    it { is_expected.to have_db_column(:menu_items).of_type(:json) }
    it { is_expected.to have_db_column(:sub_administrator_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:sms_phone_numbers).of_type(:string) }
    it { is_expected.to have_db_column(:emergency_call_number).of_type(:string) }
    it { is_expected.to have_db_column(:ga_id).of_type(:string) }
    it { is_expected.to have_db_column(:payment_keys).of_type(:json) }
    it do
      is_expected.to have_db_column(:domains).of_type(:string)
                                             .with_options(default: [], array: true)
    end
    it { is_expected.to have_db_column(:lead_monthly_targets).of_type(:json) }
  end

  describe 'associations' do
    it { is_expected.to have_many(:users).class_name('Users::User').dependent(:destroy) }
    # Refer todo in model.
    # it { is_expected.to have_many(:roles).dependent(:destroy) }
    it { is_expected.to have_many(:event_logs).class_name('Logs::EventLog').dependent(:destroy) }
    it { is_expected.to have_many(:campaigns).dependent(:destroy) }
    it do
      is_expected
        .to have_many(:discussions)
        .class_name('Discussions::Discussion')
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:labels).class_name('Labels::Label').dependent(:destroy) }
    it { is_expected.to have_many(:businesses).dependent(:destroy) }
    it { is_expected.to have_many(:entry_requests).dependent(:destroy) }
    it { is_expected.to have_many(:notes).class_name('Notes::Note').dependent(:destroy) }
    it { is_expected.to have_many(:forms).class_name('Forms::Form').dependent(:destroy) }
    it { is_expected.to have_many(:lead_logs).class_name('Logs::LeadLog').dependent(:destroy) }
    it do
      is_expected
        .to have_many(:land_parcels)
        .class_name('Properties::LandParcel')
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:accounts).class_name('Properties::Account').dependent(:destroy) }
    it do
      is_expected
        .to have_many(:notifications)
        .class_name('Notifications::Notification')
        .dependent(:destroy)
    end
    it do
      is_expected
        .to have_many(:action_flows)
        .class_name('ActionFlows::ActionFlow')
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:comments).class_name('Comments::Comment').dependent(:destroy) }
    it { is_expected.to have_many(:post_tags).class_name('PostTags::PostTag').dependent(:destroy) }
    it { is_expected.to have_many(:invoices).class_name('Payments::Invoice').dependent(:destroy) }
    it do
      is_expected
        .to have_many(:email_templates)
        .class_name('Notifications::EmailTemplate')
        .dependent(:destroy)
    end
    it do
      is_expected
        .to have_many(:substatus_logs)
        .class_name('Logs::SubstatusLog')
        .dependent(:destroy)
    end
    it do
      is_expected
        .to have_many(:wallet_transactions)
        .class_name('Payments::WalletTransaction')
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:payments).class_name('Payments::Payment').dependent(:destroy) }
    it { is_expected.to have_many(:import_logs).class_name('Logs::ImportLog').dependent(:destroy) }
    it do
      is_expected.to have_many(:transactions)
        .class_name('Payments::Transaction')
        .dependent(:destroy)
    end
    it do
      is_expected.to have_many(:plan_payments)
        .class_name('Payments::PlanPayment')
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:feedbacks).class_name('Users::Feedback').dependent(:destroy) }
    it do
      is_expected.to have_many(:time_sheets).class_name('Users::TimeSheet').dependent(:destroy)
    end
    it { is_expected.to have_many(:posts).class_name('Discussions::Post') }
    it { is_expected.to have_many(:transaction_logs).class_name('Payments::TransactionLog') }
    it { is_expected.to have_many(:amenities) }
  end

  it 'should be associated with users' do
    community = FactoryBot.create(:community)
    FactoryBot.create(:user, community: community)
    expect(community.users).to_not be_empty
  end

  it 'should be associated with users' do
    community = FactoryBot.create(:community)
    user = FactoryBot.create(:user, community: community)
    community.default_users = [user.id]
    community.save
    expect(community.default_users).to_not be_empty
  end

  describe '#notify_slack' do
    let!(:community) { create(:community, slack_webhook_url: 'https://something.com') }

    it 'invokes Slack class' do
      expect(Slack).to receive(:new).with(
        'https://something.com',
      )
      community.notify_slack('Helloo')
    end

    it "sends to Rollbar if there's exception" do
      err = StandardError.new('One stupid error!')
      allow(Slack).to receive(:new).and_raise(err)
      expect(Rollbar).to receive(:error).with(err)
      community.notify_slack('Helloo')
    end
  end

  describe 'callbacks' do
    it { is_expected.to callback(:add_default_community_features).after(:initialize) }
    it '#add_default_community_features' do
      new_community = create(:community)
      expect(new_community.features).to_not be_nil
      expect(new_community.features['Dashboard']).to_not be_nil
      expect(new_community.features['Processes']).to_not be_nil
    end
  end

  describe '#process_form_users' do
    let(:community) { create(:community) }
    let!(:admin) do
      create(:admin_user, community: community, name: 'John Doe')
    end
    let(:form) do
      create(:form, name: 'DRC Project Review Process', community: community)
    end
    let(:process) do
      create(:process,
             process_type: 'drc',
             name: 'DRC',
             form_id: form.id,
             community: community)
    end
    let!(:form_user) { create(:form_user, form: form, user: admin, status_updated_by: admin) }

    it 'should return form users of drc process type' do
      expect(community.process_form_users(process.id).first.form_id).to eql form.id
    end
  end
end
