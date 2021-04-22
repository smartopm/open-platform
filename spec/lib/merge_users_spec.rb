# frozen_string_literal: true

require 'merge_users'

RSpec.describe MergeUsers do
  before do
    Logs::EntryRequest.skip_callback(:create, :after, :log_entry)
    Forms::FormUser.skip_callback(:create, :after, :log_create_event)
    Comments::NoteComment.skip_callback(:create, :after, :log_create_event)
  end

  after do
    Logs::EntryRequest.set_callback(:create, :after, :log_entry)
    Forms::FormUser.set_callback(:create, :after, :log_create_event)
    Comments::NoteComment.set_callback(:create, :after, :log_create_event)
  end

  let!(:user) { create(:user_with_community) }
  let!(:duplicate_user) { create(:user_with_community, name: 'John Doe') }

  let!(:activity_point) { create(:activity_point, user: user, article_read: 2, referral: 10) }

  let!(:note) do
    create(:note, user: create(:user_with_community),
                  author: create(:user_with_community))
  end
  let!(:assignee_note) { create(:assignee_note, user: user, note: note) }

  let!(:business) do
    create(:business, user: user, community_id: user.community_id,
                      status: 'verified')
  end

  let!(:account) do
    create(:account, user: user, community_id: user.community_id,
                     full_name: user.name)
  end
  let!(:discussion) { create(:discussion, user: user, community_id: user.community_id) }
  let!(:comment) do
    create(:comment, user: user, community_id: user.community_id, discussion: discussion)
  end
  let!(:contact_info) { create(:contact_info, user: user) }
  let!(:discussion_user) { create(:discussion_user, user: user, discussion: discussion) }
  let!(:entry_request) { create(:pending_entry_request, user: user, community: user.community) }
  let!(:feedback) { create(:feedback, user: user, community: user.community) }
  let!(:form) { create(:form, community: user.community) }
  let!(:form_user) { create(:form_user, form: form, user: user) }
  let!(:message) { create(:message, user: user) }
  let!(:note_comment) { create(:note_comment, note: note, user: user, status: 'active') }
  let!(:note_history) do
    note.note_histories.create!(
      note: note,
      user: user,
      attr_changed: 'Attribute',
      initial_value: 'initial',
      updated_value: 'updated',
      action: %w[create update].sample,
      note_entity_type: 'Note',
      note_entity_id: note.id,
    )
  end
  let!(:payment) { create(:payment, user: user, community: user.community) }
  let!(:substatus_log) { create(:payment, user: user, community: user.community) }
  let!(:timesheet) { create(:time_sheet, user: user) }
  let!(:wallet) { create(:wallet, user: user) }
  let!(:wallet_transaction) { create(:wallet_transaction, user: user, community: user.community) }
  let!(:showroom) { create(:showroom, userId: user.id) }
  let!(:user_label) { create(:user_label, user: user) }
  let!(:activity_log) do
    create(:activity_log, reporting_user_id: user.id, community: user.community)
  end
  let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }
  let!(:payment_plan) do
    create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0)
  end
  let!(:invoice) do
    create(:invoice, community: user.community, land_parcel: land_parcel, user_id: user.id,
                     status: 'in_progress', invoice_number: '1234')
  end
  let!(:payment_plan) { create(:payment_plan, user: user, land_parcel: land_parcel) }
  let(:duplicate_wallet) { create(:wallet, user: duplicate_user) }

  shared_examples 'merges_wallet_details_and_destroy_duplicate_user' do |pending_balance, balance|
    before { MergeUsers.merge(user.id, duplicate_user.id) }

    it "merges user's duplicate wallet details" do
      expect(duplicate_wallet.reload.pending_balance).to eql pending_balance
      expect(duplicate_wallet.balance).to eql balance
      expect(duplicate_wallet.unallocated_funds).to eql balance
      expect(duplicate_user.wallets.count).to eql 1
    end
  end

  it 'updates user_id on neccessary tables' do
    MergeUsers.merge(user.id, duplicate_user.id)

    expect(activity_point.reload.user_id).to eq(duplicate_user.id)
    expect(assignee_note.reload.user_id).to eq(duplicate_user.id)
    expect(account.reload.user_id).to eq(duplicate_user.id)
    expect(account.full_name).to eq(duplicate_user.name)
    expect(comment.reload.user_id).to eq(duplicate_user.id)
    expect(contact_info.reload.user_id).to eq(duplicate_user.id)
    expect(discussion.reload.user_id).to eq(duplicate_user.id)
    expect(discussion_user.reload.user_id).to eq(duplicate_user.id)
    expect(entry_request.reload.user_id).to eq(duplicate_user.id)
    expect(feedback.reload.user_id).to eq(duplicate_user.id)
    expect(form_user.reload.user_id).to eq(duplicate_user.id)
    expect(message.reload.user_id).to eq(duplicate_user.id)
    expect(note_comment.reload.user_id).to eq(duplicate_user.id)
    expect(note_history.reload.user_id).to eq(duplicate_user.id)
    expect(payment.reload.user_id).to eq(duplicate_user.id)
    expect(substatus_log.reload.user_id).to eq(duplicate_user.id)
    expect(timesheet.reload.user_id).to eq(duplicate_user.id)
    expect(wallet_transaction.reload.user_id).to eq(duplicate_user.id)
    expect(user_label.reload.user_id).to eq(duplicate_user.id)
    expect(invoice.reload.user_id).to eq(duplicate_user.id)
    expect(payment_plan.reload.user_id).to eq(duplicate_user.id)
    expect(showroom.reload.userId).to eq(duplicate_user.id)
    expect(activity_log.reload.reporting_user_id).to eq(duplicate_user.id)
  end

  # rubocop:disable Rails/SkipsModelValidations
  context 'when balance and pending balance is positive in both wallets' do
    before do
      wallet.update_columns(pending_balance: 100, balance: 250, unallocated_funds: 250)
      duplicate_wallet.update_columns(pending_balance: 50, balance: 20, unallocated_funds: 20)
    end

    it_behaves_like 'merges_wallet_details_and_destroy_duplicate_user', 150, 270
  end

  context 'when balance and pending balance is zero in both wallets' do
    before do
      wallet.update_columns(pending_balance: 0, balance: 0, unallocated_funds: 0)
      duplicate_wallet.update_columns(pending_balance: 0, balance: 0, unallocated_funds: 0)
    end

    it_behaves_like 'merges_wallet_details_and_destroy_duplicate_user', 0, 0
  end

  context 'when balance is zero and pending balance is positive in both wallets' do
    before do
      wallet.update_columns(pending_balance: 100, balance: 0, unallocated_funds: 0)
      duplicate_wallet.update_columns(pending_balance: 50, balance: 0, unallocated_funds: 0)
    end

    it_behaves_like 'merges_wallet_details_and_destroy_duplicate_user', 150, 0
  end

  context 'when balance is positive and pending balance is zero in both wallets' do
    before do
      wallet.update_columns(pending_balance: 0, balance: 110, unallocated_funds: 110)
      duplicate_wallet.update_columns(pending_balance: 0, balance: 110, unallocated_funds: 110)
    end

    it_behaves_like 'merges_wallet_details_and_destroy_duplicate_user', 0, 220
  end

  context 'when balance is positive in one wallet and zero in other wallet' do
    before do
      wallet.update_columns(pending_balance: 100, balance: 110, unallocated_funds: 110)
      duplicate_wallet.update_columns(pending_balance: 70, balance: 0, unallocated_funds: 0)
    end

    it_behaves_like 'merges_wallet_details_and_destroy_duplicate_user', 170, 110
  end

  context 'when pending balance is zero in one wallet and positive in other wallet' do
    before do
      wallet.update_columns(pending_balance: 0, balance: 110, unallocated_funds: 110)
      duplicate_wallet.update_columns(pending_balance: 0, balance: 10, unallocated_funds: 10)
    end

    it_behaves_like 'merges_wallet_details_and_destroy_duplicate_user', 0, 120
  end
  # rubocop:enable Rails/SkipsModelValidations
end
