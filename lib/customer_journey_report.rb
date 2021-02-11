# frozen_string_literal: true

# Customer Journey Report
class CustomerJourneyReport
  def self.generate_substatus_time_distribution
    rows = execute_aggregate_time_distribution_query(aggregate_time_lapse_sql)

    create_distribution_report(rows)
  end

  # rubocop:disable Metrics/MethodLength
  def self.create_distribution_report(rows)
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

    rows.present? && rows.each do |row|
      sub_status, time_lapse, count = row

      hash[sub_status.to_sym][time_lapse.to_sym] = count
    end

    hash
  end
  # rubocop:enable  Metrics/MethodLength

  def self.execute_aggregate_time_distribution_query(sql)
    User.connection.select_all(sql).rows
  end

  def self.aggregate_time_lapse_sql
    time_lapse_range = {
      from0to10: 'between0to10Days',
      from11to30: 'between11to30Days',
      from31to50: 'between31to50Days',
      from51to150: 'between51to150Days',
      over151: 'over151Days',
    }

    <<~QUERY
      SELECT ssl.new_status,
      CASE
        WHEN DATE_PART('day', CURRENT_TIMESTAMP - ssl.start_date)>= 0
            AND DATE_PART('day', CURRENT_TIMESTAMP - ssl.start_date) <= 10 THEN '#{time_lapse_range[:from0to10]}'
        WHEN DATE_PART('day', CURRENT_TIMESTAMP - ssl.start_date) >= 11
            AND DATE_PART('day', CURRENT_TIMESTAMP - ssl.start_date) <= 30 THEN '#{time_lapse_range[:from11to30]}'
        WHEN DATE_PART('day', CURRENT_TIMESTAMP - ssl.start_date) >= 31
            AND DATE_PART('day', CURRENT_TIMESTAMP - ssl.start_date) <= 50 THEN '#{time_lapse_range[:from31to50]}'
        WHEN DATE_PART('day', CURRENT_TIMESTAMP - ssl.start_date) >= 51
            AND DATE_PART('day', CURRENT_TIMESTAMP - ssl.start_date) <= 150 THEN '#{time_lapse_range[:from51to150]}'
        WHEN DATE_PART('day', CURRENT_TIMESTAMP - ssl.start_date)>= 151 THEN '#{time_lapse_range[:over151]}'
      END bucket,
      COUNT(*)
      FROM substatus_logs ssl
      INNER JOIN users ON ssl.id = users.latest_substatus_id
      WHERE ssl.new_status IS NOT NULL
      GROUP BY ssl.new_status, bucket
    QUERY
  end
end
