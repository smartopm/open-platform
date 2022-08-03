import React from 'react';
import { render } from '@testing-library/react';
import ListHeader from "../list/ListHeader";


describe('AddmoreButton', () => {
  it('should render the add more button', () => {
    const headers = [
        { title: 'Issue Date', col: 2 },
        { title: 'Description', col: 4 },
        { title: 'Amount', col: 3 },
        { title: 'Payment Date', col: 3 },
        { title: 'Status', col: 4 },
      ];
    const listHeader = render(<ListHeader headers={headers} />);
    expect(listHeader.queryByText('Issue Date')).toBeInTheDocument()
    expect(listHeader.queryByText('Description')).toBeInTheDocument()
    expect(listHeader.queryByText('Amount')).toBeInTheDocument()
    expect(listHeader.queryByText('Payment Date')).toBeInTheDocument()
    expect(listHeader.queryByText('Status')).toBeInTheDocument()

  });
});
