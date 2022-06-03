import React from 'react';
import { render } from '@testing-library/react';

import CampaignStatCard from '../components/CampaignStatCard';

describe('It should render campaign Star Card', () => {
  it('should render campaign stat card component', () => {
    const data = {
      totalScheduled: 10,
      totalSent: 8,
      totalOpened: 7,
      totalClicked: 5,
    }
    const container = render(
      <CampaignStatCard data={data} />
    );

    expect(container.queryByTestId('total-scheduled')).toBeInTheDocument();
    expect(container.queryByTestId('total-sent')).toBeInTheDocument();
    expect(container.queryByTestId('open-rate')).toBeInTheDocument();
    expect(container.queryByTestId('click-rate')).toBeInTheDocument();
    expect(container.queryByText('10')).toBeInTheDocument();
    expect(container.queryByText('8')).toBeInTheDocument();
    expect(container.queryByText('7')).toBeInTheDocument();
    expect(container.queryByText('5')).toBeInTheDocument();
  });
});

