# frozen_string_literal: true

# Messages being sent out
class Message < ApplicationRecord
  belongs_to :user
  belongs_to :sender, class_name: 'User'
  has_one :campaign, dependent: :restrict_with_exception

  after_create :create_message_task

  default_scope { order(created_at: :asc) }

  class Unauthorized < StandardError; end

  def self.users_newest_msgs(query, offset, limit, com_id, filter)
    Message.find_by_sql(["SELECT messages.* FROM messages
      INNER JOIN ( SELECT user_id, max(messages.created_at) as max_date FROM messages
      INNER JOIN users ON users.id = messages.user_id INNER JOIN users senders_messages
      ON senders_messages.id = messages.sender_id
      WHERE ((users.community_id=? AND senders_messages.community_id=?" +
      campaign_query(filter) + ") AND (users.name ILIKE ? OR users.phone_number ILIKE ?
      OR users.name ILIKE ? OR users.phone_number ILIKE ? OR messages.message ILIKE ?))
      GROUP BY messages.user_id ORDER BY max_date DESC LIMIT ? OFFSET ?) max_list
      ON messages.created_at = max_list.max_date ORDER BY max_list.max_date DESC"] +
      Array.new(2, com_id) + Array.new(5, "%#{query}%") + [limit, offset])
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
    new_message += "#{message} \n\n#{text} \n#{link}"
    Sms.send(receiver, new_message)
  end

  def create_message_task
    msg_obj = {
      body: "Reply to message from: #{user.name}",
      category: "message",
      flagged: true,
      completed: false,
      due_date: 5.days.from_now
    }
    note_id = user.generate_note(msg_obj).id
    assign_message_task(note_id)
  end

  def find_user_id(email, name)
    EmailMsg.find_user(email, name).id
  end

  def get_community_name
    user.community.name
  end

  def assign_message_task(note_id) 
    community_list = { "Nkwashi" => "#{find_user_id("mutale@doublegdp.com", "Nkwashi")}" }
    user.community.notes.find(note_id).assign_or_unassign_user(community_list["#{get_community_name}"])
  end

  def self.campaign_query(filter)
    return '' if filter.nil?

    null_check = filter.eql?('campaign') ? 'NOT NULL' : 'NULL'
    "AND messages.campaign_id IS #{null_check}"
  end
end
