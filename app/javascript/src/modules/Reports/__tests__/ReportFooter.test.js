import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ReportFooter from '../components/ReportFooter';

describe('ReportFooter Component', () => {
  it('should mount component correctly', () => {
    const container = render(<ReportFooter />);
    expect(container.queryByText('misc.sub_admin')).toBeInTheDocument()
    expect(container.queryByText('misc.customs_admin')).toBeInTheDocument()
    expect(container.queryByText('misc.customs_post')).toBeInTheDocument()
    expect(container.queryByText('Ciudad Moraźan')).toBeInTheDocument()
  });
});
