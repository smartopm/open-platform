import React from 'react';
import { render } from '@testing-library/react';

import ReportList from '../components/ReportsList';

describe('ReportList Component', () => {
  it('should mount component correctly', () => {
    const container = render(<ReportList />);
    expect(container.queryByText('report:misc.report_title')).toBeInTheDocument()
  });
});
