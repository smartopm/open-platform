import React from 'react';
import { render } from '@testing-library/react';

import ReportHeader from '../components/ReportHeader';

describe('ReportHeader Component', () => {
  it('should mount component correctly', () => {
    const reportingDate = {
        endDate: new Date(),
        startDate: new Date("2021-07-19")
    }
    const container = render(<ReportHeader reportingDate={reportingDate} subAdministrator="Captain John" />);
    expect(container.queryByText('misc.customs')).toBeInTheDocument()
    expect(container.queryByText('ZEDE Moraźan - 9100')).toBeInTheDocument()
    expect(container.queryByText('misc.sub_admin')).toBeInTheDocument()
    expect(container.queryByText('misc.reporting_period')).toBeInTheDocument()
    expect(container.queryByText('Captain John')).toBeInTheDocument()
  });
});
