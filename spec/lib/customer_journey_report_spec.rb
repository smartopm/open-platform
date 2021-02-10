# frozen_string_literal: true

require 'customer_journey_report'

RSpec.describe CustomerJourneyReport do
  
  it 'shouldshow time lapse \'between0to10Days\' for 1 user with substatus \'plots_fully_purchased\'' do
    start_date = DateTime.now.in_time_zone('Africa/Lusaka')

    data = [{
      start_date: start_date,
      sub_status: 'plots_fully_purchased'
    }]

    distribution_report = CustomerJourneyReport
                          .generate_substatus_time_distribution(data)
  end

  it 'should show time lapse \'between51to150Days\' for 2 users with substatus \'plots_fully_purchased\'' do
    date_time = DateTime.now.in_time_zone('Africa/Lusaka')
    start_date = date_time - 60 # 2 months ago
    data = [
      {
        start_date: start_date,
        sub_status: 'plots_fully_purchased'
      },
      {
        start_date: start_date,
        sub_status: 'plots_fully_purchased'
      }
    ]

    distribution_report = CustomerJourneyReport
                          .generate_substatus_time_distribution(data)
  end
end
