import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { StatusList } from '../../shared/Status';
import { userSubStatus } from '../../utils/constants';

describe('Status List Component', () => {
  const list = {
    applied: 4,
    approved: 4,
    architectureReviewed: 2,
    interested: null,
    built: null,
    contracted: 1,
    inConstruction: 0,
    movedIn: 4,
    paying: null,
    readyForConstruction: 1
  };

  it('should render a list of status with correct count', () => {
    const container = render(<StatusList data={list} statuses={userSubStatus} />);
    expect(container.queryAllByText('2')[0]).toBeInTheDocument();
    expect(container.queryAllByText('0')[0]).toBeInTheDocument();
    expect(container.queryAllByText('0')).toHaveLength(4);
    expect(container.queryAllByText('1')).toHaveLength(2);
    expect(container.queryAllByText('4')).toHaveLength(3);
    expect(container.queryByText('Architecture Reviewed')).toBeInTheDocument();
    expect(container.queryByText('Approved')).toBeInTheDocument();
    expect(container.queryByText('Applied')).toBeInTheDocument();
    expect(container.queryByText('Interested')).toBeInTheDocument();
    expect(container.queryByText('In Construction')).toBeInTheDocument();
    expect(container.queryByText('Moved-In')).toBeInTheDocument();
  });
});
