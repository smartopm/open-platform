# frozen_string_literal: true

require 'customer_journey_report'

RSpec.describe CustomerJourneyReport do
  it 'should show 1 count for time-lapse \'0 - 10 Days\' substatus \'plots_fully_purchased\'' do
    mock_aggregate_query_result = [
      ['plots_fully_purchased', 'between0to10Days', 1],
    ]

    distribution_report = CustomerJourneyReport
                          .create_distribution_report(mock_aggregate_query_result)

    expect(distribution_report).not_to be_nil
    expect(distribution_report[:plots_fully_purchased][:between0to10Days]).to eq 1
  end

  it 'should show 2 counts for time-lapse \'51 - 150 Days\' substatus \'plots_fully_purchased\'' do
    mock_aggregate_query_result = [
      ['plots_fully_purchased', 'between51to150Days', 2],
    ]

    distribution_report = CustomerJourneyReport
                          .create_distribution_report(mock_aggregate_query_result)

    expect(distribution_report).not_to be_nil
    expect(distribution_report[:plots_fully_purchased][:between51to150Days]).to eq 2
  end
end
