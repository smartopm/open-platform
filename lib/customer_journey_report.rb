# frozen_string_literal: true

# Customer Journey Report
class CustomerJourneyReport
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def self.generate_substatus_time_distribution(data)
    hash = {
      plots_fully_purchased: Hash.new(0),
      eligible_to_start_construction: Hash.new(0),
      floor_plan_purchased: Hash.new(0),
      construction_approved: Hash.new(0),
      construction_in_progress: Hash.new(0),
      construction_completed: Hash.new(0),
      census: Hash.new(0),
      workers_on_site: Hash.new(0),
    }

    data.each do |u|
      no_of_days = no_of_days_since_latest_substatus(u[:start_date])

      range = time_distribution(no_of_days)

      hash[u[:sub_status].to_sym][range[:time_lapse].to_sym] += range[:increment]
    end

    hash
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  # rubocop:disable Metrics/MethodLength
  def self.time_distribution(no_of_days)
    time_lapse_range = {
      from0to10: 'between0to10Days',
      from11to30: 'between11to30Days',
      from31to50: 'between31to50Days',
      from51to150: 'between51to150Days',
      over151: 'over151Days',
    }

    case no_of_days
    when 0..10
      { time_lapse: time_lapse_range[:from0to10], increment: 1 }
    when 11..30
      { time_lapse: time_lapse_range[:from11to30], increment: 1 }
    when 31..50
      { time_lapse: time_lapse_range[:from31to50], increment: 1 }
    when 51..150
      { time_lapse: time_lapse_range[:from51to150], increment: 1 }
    when no_of_days >= 151
      { time_lapse: time_lapse_range[:over151], increment: 1 }
    end
  end
  # rubocop:enable Metrics/MethodLength

  def self.current_datetime_in_time_zone
    DateTime.now.in_time_zone('Africa/Lusaka')
  end

  def self.no_of_days_since_latest_substatus(start_date)
    return 0 if start_date.blank?

    (current_datetime_in_time_zone - start_date).to_i / (24 * 60 * 60)
  end
end
