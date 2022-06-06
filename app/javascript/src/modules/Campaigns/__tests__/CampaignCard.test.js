import React from 'react';
import { render } from '@testing-library/react';

import CampaignCard from '../components/CampaignCard';

describe('It should render campaign Card', () => {
  const camp = {
    batchTime: '2022-10-10',
    name: 'sample-campaign',
    id: 'wuy343'
  };

  const menuData = {
    handleMenu: jest.fn()
  };

  it('should render campaign card component', () => {
    const container = render(
      <CampaignCard camp={camp} menuData={menuData} handleClick={jest.fn()} />
    );

    expect(container.queryByTestId('name')).toBeInTheDocument();
    expect(container.queryByTestId('batch-time')).toBeInTheDocument();
    expect(container.queryByTestId('campaign-item-menu')).toBeInTheDocument();
  });
});
