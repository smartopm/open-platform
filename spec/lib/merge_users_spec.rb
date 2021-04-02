# frozen_string_literal: true

require 'merge_users'

RSpec.describe MergeUsers do
  before do
    EntryRequest.skip_callback(:create, :after, :log_entry)
    FormUser.skip_callback(:create, :after, :log_create_event)
    NoteComment.skip_callback(:create, :after, :log_create_event)
  end

  after do
    EntryRequest.set_callback(:create, :after, :log_entry)
    FormUser.set_callback(:create, :after, :log_create_event)
    NoteComment.set_callback(:create, :after, :log_create_event)
  end

  let!(:user) { create(:user_with_community) }
  let!(:duplicate_user) { create(:user_with_community) }

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

  let!(:account) { create(:account, user: user, community_id: user.community_id) }
  let!(:discussion) { create(:discussion, user: user, community_id: user.community_id) }
  let!(:comment) do
    create(:comment, user: user, community_id: user.community_id, discussion: discussion)
  end
  let!(:contact_info) { create(:contact_info, user: user) }
  let!(:discussion_user) { create(:discussion_user, user: user, discussion: discussion) }
  let!(:entry_request) { create(:pending_entry_request, user: user, community: user.community) }
  let!(:feedback) { create(:feedback, user: user) }
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
  let!(:wallet_transaction) { create(:wallet, user: user) }
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

  it 'updates user_id on neccessary tables' do
    MergeUsers.merge(user.id, duplicate_user.id)

    expect(activity_point.reload.user_id).to eq(duplicate_user.id)
    expect(assignee_note.reload.user_id).to eq(duplicate_user.id)
    expect(account.reload.user_id).to eq(duplicate_user.id)
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
    expect(wallet.reload.user_id).to eq(duplicate_user.id)
    expect(wallet_transaction.reload.user_id).to eq(duplicate_user.id)
    expect(user_label.reload.user_id).to eq(duplicate_user.id)
    expect(invoice.reload.user_id).to eq(duplicate_user.id)
    expect(payment_plan.reload.user_id).to eq(duplicate_user.id)

    expect(showroom.reload.userId).to eq(duplicate_user.id)
    expect(activity_log.reload.reporting_user_id).to eq(duplicate_user.id)
  end
end
