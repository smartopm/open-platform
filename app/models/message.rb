# frozen_string_literal: true

# Messages being sent out
class Message < ApplicationRecord
  include NoteHistoryRecordable

  belongs_to :user
  belongs_to :sender, class_name: 'User'
  belongs_to :note, optional: true
  belongs_to :note_entity, polymorphic: true, optional: true
  has_one :notification, as: :notifable, dependent: :destroy
  has_one :campaign, dependent: :restrict_with_exception

  default_scope { order(created_at: :asc) }
  after_create :update_campaign_message_count, if: :campaign_id?
  after_update :update_campaign_message_count, if: proc { saved_change_to_campaign_id? }

  VALID_CATEGORY = %w[email sms].freeze
  validates :category, inclusion: { in: VALID_CATEGORY, allow_nil: false }

  class Unauthorized < StandardError; end

  def self.users_newest_msgs(query, off, lmt, comid, filt)
    Message.find_by_sql(["SELECT messages.* FROM messages
     INNER JOIN ( SELECT user_id, max(messages.created_at) as max_date FROM messages
     INNER JOIN users ON users.id = messages.user_id INNER JOIN users senders_messages
     ON senders_messages.id = messages.sender_id WHERE ((users.community_id=?
     AND senders_messages.community_id=?" + campaign_query(filt[:filter]) + ")
     AND (users.name ILIKE ? OR users.phone_number ILIKE ? OR users.name ILIKE ?
     OR users.phone_number ILIKE ? OR messages.message ILIKE ?)" + category_query(filt[:cat]) + ")
     GROUP BY messages.user_id ORDER BY max_date DESC LIMIT ? OFFSET ?) max_list
     ON messages.created_at = max_list.max_date ORDER BY max_list.max_date DESC"] +
     Array.new(2, comid) + Array.new(5, "%#{query}%") + [lmt, off])
  end

  def mark_as_read
    update(is_read: true, read_at: DateTime.now) unless is_read
  end

  def send_sms(add_prefix: true)
    return if receiver.nil?

    new_message = ''
    text = 'Click this link to reply to this message in our app '
    link = "https://#{ENV['HOST']}/message/#{user_id}"
    new_message = "#{sender[:name]} from Nkwashi said: \n" if add_prefix
    new_message += message
    new_message += "\n\n#{text} \n#{link}" if include_reply_link?
    Sms.send(receiver, new_message)
  end

  def create_message_task(body = nil)
    msg_obj = {
      body: "Reply to <a href=\"https://#{ENV['HOST']}/message/#{user.id}\">message</a>
      from: #{user.name} \n #{body}",
      category: 'message',
      flagged: true,
      completed: false,
      due_date: 5.days.from_now,
    }
    note_id = user.generate_note(msg_obj).id
    assign_message_task(note_id)
  end

  def assign_message_task(note_id)
    assign = user.community.notes.find(note_id)
                 .assign_or_unassign_user(user.community.default_community_users[0].id)
    return assign unless assign.nil?
  end

  def self.category_query(filter)
    return '' if filter.blank?

    " AND messages.category ILIKE '%#{filter}%'"
  end

  def self.campaign_query(filter)
    return '' if filter.nil?

    null_check = filter.eql?('campaign') ? 'NOT NULL' : 'NULL'
    "AND messages.campaign_id IS #{null_check}"
  end

  def update_campaign_message_count
    count = Message.where(campaign_id: campaign_id).count
    return if Campaign.find(campaign_id)&.update(message_count: count)

    raise StandardError, 'Campaign message count update failed'
  end

  def include_reply_link?
    return false if campaign_id.nil?

    Campaign.find(campaign_id).include_reply_link
  end
end
