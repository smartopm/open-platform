# frozen_string_literal: true

require 'merge_users'

RSpec.describe MergeUsers do
  before do
    Forms::FormUser.skip_callback(:create, :after, :log_create_event)
    Comments::NoteComment.skip_callback(:create, :after, :log_create_event)
  end

  after do
    Forms::FormUser.set_callback(:create, :after, :log_create_event)
    Comments::NoteComment.set_callback(:create, :after, :log_create_event)
  end

  let!(:user) { create(:user_with_community) }
  let!(:community) { user.community }
  let!(:duplicate_user) { create(:user, community: community, name: 'John Doe', role: user.role) }
  let!(:other_user) { create(:user, community: community, name: 'John Doe', role: user.role) }
  let!(:activity_point) { create(:activity_point, user: user, article_read: 2, referral: 10) }

  let!(:note) { create(:note, user: user, author: user) }
  let!(:assignee_note) { create(:assignee_note, user: user, note: note) }
  let(:other_assignee_note) { create(:assignee_note, user: duplicate_user, note: note) }
  let!(:business) do
    create(:business, user: user, community_id: community.id,
                      status: 'verified')
  end

  let!(:account) do
    create(:account, user: user, community_id: community.id,
                     full_name: user.name)
  end
  let!(:discussion) { create(:discussion, user: user, community_id: community.id) }
  let!(:comment) do
    create(:comment, user: user, community_id: community.id, discussion: discussion)
  end
  let!(:contact_info) { create(:contact_info, user: user) }
  let!(:discussion_user) { create(:discussion_user, user: user, discussion: discussion) }
  let(:other_discussion_user) do
    create(:discussion_user, user: duplicate_user, discussion: discussion)
  end
  let!(:entry_request) do
    create(:pending_entry_request, user: user, community: community, grantor: user)
  end
  let!(:feedback) { create(:feedback, user: user, community: community) }
  let!(:form) { create(:form, community: community) }
  let!(:category) { create(:category, form: form) }
  let!(:form_property) { create(:form_property, form: form, category: category) }
  let!(:form_user) { create(:form_user, form: form, user: user, status_updated_by: user) }
  let!(:user_form_property) do
    create(:user_form_property, form_property: form_property, form_user: form_user, user: user)
  end
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
      note_entity_type: 'Notes::Note',
      note_entity_id: note.id,
    )
  end
  let!(:payment) { create(:payment, user: user, community: community) }
  let!(:substatus_log) { create(:payment, user: user, community: community) }
  let!(:timesheet) { create(:time_sheet, user: user, community: community) }
  let!(:wallet) { create(:wallet, user: user) }
  let!(:wallet_transaction) { create(:wallet_transaction, user: user, community: community) }
  let!(:showroom) { create(:showroom, user_id: user.id) }
  let!(:user_label) { create(:user_label, user: user) }
  let!(:activity_log) do
    create(:activity_log, reporting_user_id: user.id, community: community)
  end
  let!(:land_parcel) { create(:land_parcel, community_id: community.id) }
  let!(:payment_plan) do
    create(:payment_plan, land_parcel_id: land_parcel.id, user_id: user.id, plot_balance: 0)
  end
  let!(:other_payment_plan) do
    create(:payment_plan, land_parcel_id: land_parcel.id, user_id: other_user.id)
  end
  let!(:plan_ownership) do
    create(:plan_ownership, user: user, payment_plan: other_payment_plan)
  end
  let(:other_plan_ownership) do
    create(:plan_ownership, user: duplicate_user, payment_plan: other_payment_plan)
  end
  let!(:transaction) do
    create(:transaction, user_id: user.id, community_id: community.id, amount: 500,
                         depositor_id: user.id)
  end
  let!(:plan_payment) do
    create(:plan_payment, user_id: user.id, community_id: community.id,
                          transaction_id: transaction.id, payment_plan_id: payment_plan.id,
                          amount: 500)
  end
  let!(:invoice) do
    create(:invoice, community: community, land_parcel: land_parcel, user_id: user.id,
                     payment_plan: payment_plan, status: 'in_progress', invoice_number: '1234')
  end
  let!(:payment_plan) { create(:payment_plan, user: user, land_parcel: land_parcel) }
  let!(:post_tag) { create(:post_tag, community: community) }
  let!(:post_tag_user) { create(:post_tag_user, post_tag: post_tag, user: user) }
  let(:other_post_tag_user) { create(:post_tag_user, post_tag: post_tag, user: duplicate_user) }
  let(:duplicate_wallet) { create(:wallet, user: duplicate_user) }
  let!(:event_log) do
    create(:event_log, community_id: community.id, acting_user_id: user.id,
                       ref_type: 'Users::User', ref_id: user.id, subject: 'user_entry')
  end
  let!(:other_contact_info) do
    create(:contact_info, user: user, contact_type: 'phone', info: '99998888')
  end
  let!(:duplicate_contact_info) do
    create(:contact_info, user: duplicate_user, contact_type: 'phone', info: '99998888')
  end

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
    community.update(sub_administrator_id: user.id)
    expect(Users::ContactInfo.count).to eq 3
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
    expect(entry_request.grantor_id).to eq(duplicate_user.id)
    expect(feedback.reload.user_id).to eq(duplicate_user.id)
    expect(form_user.reload.user_id).to eq(duplicate_user.id)
    expect(form_user.status_updated_by_id).to eq(duplicate_user.id)
    expect(user_form_property.reload.user_id).to eq(duplicate_user.id)
    expect(message.reload.user_id).to eq(duplicate_user.id)
    expect(note.reload.user_id).to eq(duplicate_user.id)
    expect(note.author_id).to eq(duplicate_user.id)
    expect(note_comment.reload.user_id).to eq(duplicate_user.id)
    expect(note_history.reload.user_id).to eq(duplicate_user.id)
    expect(payment.reload.user_id).to eq(duplicate_user.id)
    expect(substatus_log.reload.user_id).to eq(duplicate_user.id)
    expect(timesheet.reload.user_id).to eq(duplicate_user.id)
    expect(wallet_transaction.reload.user_id).to eq(duplicate_user.id)
    expect(user_label.reload.user_id).to eq(duplicate_user.id)
    expect(invoice.reload.user_id).to eq(duplicate_user.id)
    expect(payment_plan.reload.user_id).to eq(duplicate_user.id)
    expect(showroom.reload.user_id).to eq(duplicate_user.id)
    expect(activity_log.reload.reporting_user_id).to eq(duplicate_user.id)
    expect(plan_ownership.reload.user_id).to eq(duplicate_user.id)
    expect(Properties::PlanOwnership.count).to eql 1
    expect(transaction.reload.user_id).to eq(duplicate_user.id)
    expect(transaction.depositor_id).to eq(duplicate_user.id)
    expect(plan_payment.reload.user_id).to eq(duplicate_user.id)
    expect(business.reload.user_id).to eq(duplicate_user.id)
    expect(post_tag_user.reload.user_id).to eq(duplicate_user.id)
    expect(community.reload.sub_administrator_id).to eq(duplicate_user.id)
    expect(event_log.reload.acting_user_id).to eq(duplicate_user.id)
    expect(event_log.ref_id).to eq(duplicate_user.id)
    expect(Users::ContactInfo.count).to eq 2
  end

  context 'when user have general plan and duplicate user do not have general plan' do
    before do
      user.general_payment_plan.plan_payments.create!(transaction_id: transaction.id,
                                                      community_id: community.id,
                                                      user_id: user.id, amount: 50.0)
    end

    it 'transfers the payments of general plan and destroys the general plan and land parcel' do
      MergeUsers.merge(user.id, duplicate_user.id)

      expect(duplicate_user.general_payment_plan.plan_payments.first.amount.to_f).to eql 50.0
    end
  end

  context 'when both user and duplicate user have general plan' do
    before do
      user.general_payment_plan.plan_payments.create!(transaction_id: transaction.id,
                                                      community_id: community.id,
                                                      user_id: user.id, amount: 50.0)
      duplicate_user.general_payment_plan
    end

    it 'transfers the payments of general plan and destroys the general plan and land parcel' do
      MergeUsers.merge(user.id, duplicate_user.id)

      expect(duplicate_user.reload.land_parcels.general.count).to eql 1
      expect(duplicate_user.reload.payment_plans.general.count).to eql 1
      expect(duplicate_user.general_payment_plan.plan_payments.first.amount.to_f).to eql 50.0
    end
  end

  context 'when both users are co-owners of same payment plan' do
    before { other_plan_ownership }

    it "does not assigns user' plan ownewrship to duplicate user and destroys it" do
      expect(Properties::PlanOwnership.count).to eql 2
      MergeUsers.merge(user.id, duplicate_user.id)
      expect(Properties::PlanOwnership.count).to eql 1
      expect(other_plan_ownership.id).not_to be_nil
    end
  end

  context 'when user is owner and duplicate user is co-owner of same payment plan' do
    before { other_payment_plan.update(user_id: duplicate_user.id) }

    it "does not assigns user' plan ownewrship to duplicate user and destroys it" do
      MergeUsers.merge(user.id, duplicate_user.id)
      expect(Properties::PlanOwnership.count).to eql 0
    end
  end

  context 'when discussion user for common discussion, assignee not for common note,
            post tag user for post tag is present' do
    before do
      other_discussion_user
      other_post_tag_user
      other_assignee_note
    end
    it 'does not assigns the discussion user, post tag user and assignee note and destroys them' do
      expect(Discussions::DiscussionUser.count).to eql 2
      expect(Notes::AssigneeNote.count).to eql 2
      expect(PostTags::PostTagUser.count).to eql 2
      MergeUsers.merge(user.id, duplicate_user.id)
      expect(Discussions::DiscussionUser.count).to eql 1
      expect(Notes::AssigneeNote.count).to eql 1
      expect(PostTags::PostTagUser.count).to eql 1
      expect(other_discussion_user.id).not_to be_nil
      expect(other_post_tag_user.id).not_to be_nil
      expect(other_assignee_note.id).not_to be_nil
    end
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
