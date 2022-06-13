# frozen_string_literal: true

desc "Create substatus logs as per with user's substatus"
task sync_substatus_logs_with_users_substatus: :environment do
  # Returns the most recent date when a substatus was updated for a user
  #
  # @return [Date]
  def get_date(user)
    date = user.versions.select { |version| version&.object&.include?('sub_status') }
               .last&.created_at
    date.eql?(nil) ? user.created_at : date
  end

  # Creates sub status log for a user
  #
  # @return [SubstatusLog]
  def create_sub_status_log(user, start_date, previous_status = nil)
    Logs::SubstatusLog.create!(
      new_status: user.sub_status,
      start_date: start_date,
      user_id: user.id,
      community_id: user.community_id,
      previous_status: previous_status,
      stop_date: nil,
    )
  end

  puts 'Creating substatus logs for users with substatus and no associated substatus logs ...'
  users = User.left_joins(:substatus_logs).where(Users::User.arel_table[:sub_status].not_eq(nil)
                                        .and(Logs::SubstatusLog.arel_table[:id].eq(nil)))

  users.each do |user|
    start_date = get_date(user)
    new_substatus_log = create_sub_status_log(user, start_date)

    if new_substatus_log.present?
      user.update!(latest_substatus_id: new_substatus_log.id)
      puts "Created sub status log for user with id: #{user.id}"
    end
  end

  puts 'Creating substatus logs for users with updated substatus ...'
  users = Users::User.joins(:substatus_logs).uniq
  users.each do |user|
    substatus_log = Logs::SubstatusLog.find_by(id: user.latest_substatus_id)
    next if substatus_log.new_status.eql?(user.sub_status)

    start_date = get_date(user)
    new_substatus_log = create_sub_status_log(user, start_date, substatus_log.new_status)

    if new_substatus_log.present?
      user.update!(latest_substatus_id: new_substatus_log.id)
      puts "Created sub status log for user with id: #{user.id}"
    end
  end
end
