import React from 'react';
import { render } from '@testing-library/react';

import { StatusList } from '../../../shared/Status';
import { userSubStatus } from '../../../utils/constants';

describe('Status List Component', () => {
  const list = {
    plotsFullyPurchased: 4,
    eligibleToStartConstruction: 1,
    floorPlanPurchased: 2,
    buildingPermitApproved: null,
    constructionInProgress: null,
    constructionCompleted: 1,
    constructionInProgressSelfBuild: null,
  };

  it('should render a list of status with correct count', () => {
    const container = render(<StatusList data={list} statuses={userSubStatus} />);
    expect(container.queryAllByText('2')[0]).toBeInTheDocument();
    expect(container.queryAllByText('0')[0]).toBeInTheDocument();
    expect(container.queryAllByText('0')).toHaveLength(3);
    expect(container.queryAllByText('1')).toHaveLength(2);
    expect(container.queryAllByText('4')).toHaveLength(1);
    expect(container.queryByText('Plots Fully Purchased')).toBeInTheDocument();
    expect(container.queryByText('Eligible to start Construction')).toBeInTheDocument();
    expect(container.queryByText('Building Permit Approved')).toBeInTheDocument();
    expect(container.queryByText('Construction in Progress')).toBeInTheDocument();
    expect(container.queryByText('Construction Completed')).toBeInTheDocument();
    expect(container.queryByText('Construction in Progress (Self Build)')).toBeInTheDocument();
  });
});
