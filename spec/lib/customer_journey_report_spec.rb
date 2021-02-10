# frozen_string_literal: true

require 'customer_journey_report'

RSpec.describe CustomerJourneyReport do
  it 'should show 1 count for time-lapse \'0 - 10 Days\' substatus \'plots_fully_purchased\'' do
    start_date = DateTime.now.in_time_zone('Africa/Lusaka')

    data = [{
      start_date: start_date,
      sub_status: 'plots_fully_purchased',
    }]

    distribution_report = CustomerJourneyReport
                          .generate_substatus_time_distribution(data)

    expect(distribution_report).not_to be_nil
    expect(distribution_report[:plots_fully_purchased][:between0to10Days]).to eq 1
  end

  it 'should show 2 counts for time-lapse \'51 - 150 Days\' substatus \'plots_fully_purchased\'' do
    today = DateTime.now.in_time_zone('Africa/Lusaka')
    start_date = today.to_datetime - 60 # 2 months ago
    data = [
      {
        start_date: start_date,
        sub_status: 'plots_fully_purchased',
      },
      {
        start_date: start_date,
        sub_status: 'plots_fully_purchased',
      },
    ]

    distribution_report = CustomerJourneyReport
                          .generate_substatus_time_distribution(data)
    
    expect(distribution_report).not_to be_nil
    expect(distribution_report[:plots_fully_purchased][:between51to150Days]).to eq 2
  end
end
