import { render } from '@testing-library/react';
import React from 'react';
import LogsReportView from '../Components/LogsReportView';
import '@testing-library/jest-dom/extend-expect';

describe('LogsReportView', () => {
  it('should properly render the logs report view', () => {
    const wrapper = render(
      <LogsReportView
        startDate="2020-10-10"
        endDate="2020-10-10"
        handleChange={jest.fn()}
        isSmall={false}
      >
        <p>This is a young child</p>
      </LogsReportView>
    );
    expect(wrapper.queryByText('This is a young child')).toBeInTheDocument();
    expect(wrapper.queryByText('guest_book.gate_flow_report')).toBeInTheDocument();
    expect(wrapper.queryAllByText('guest_book.start_date')[0]).toBeInTheDocument();
    expect(wrapper.queryAllByText('guest_book.end_date')[0]).toBeInTheDocument();

    const anotherWrapper = render(
      <LogsReportView
        startDate="2020-10-10"
        endDate="2020-10-10"
        handleChange={jest.fn()}
        isSmall
      >
        <p>This is a young child</p>
      </LogsReportView>
    );
    expect(anotherWrapper.queryAllByText('guest_book.from')[0]).toBeInTheDocument();
    expect(anotherWrapper.queryAllByText('guest_book.to')[0]).toBeInTheDocument();
  });
});
