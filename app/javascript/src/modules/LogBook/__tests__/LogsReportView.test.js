import { render } from '@testing-library/react';
import React from 'react';
import LogsReportView from '../Components/LogsReportView';


describe('LogsReportView', () => {
  it('should properly render the logs report view', () => {
    const wrapper = render(
      <LogsReportView
        startDate="2020-10-10"
        endDate="2020-10-10"
        handleChange={jest.fn()}
      >
        <p>This is a young child</p>
      </LogsReportView>
    );
    expect(wrapper.queryByText('This is a young child')).toBeInTheDocument();
    expect(wrapper.queryByText('guest_book.gate_flow_report')).toBeInTheDocument();
    expect(wrapper.queryAllByText('guest_book.start_date')[0]).toBeInTheDocument();
    expect(wrapper.queryAllByText('guest_book.end_date')[0]).toBeInTheDocument();
  });
});
