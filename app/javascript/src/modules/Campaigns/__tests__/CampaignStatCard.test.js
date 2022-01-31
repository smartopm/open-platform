import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CampaignStatCard from '../components/CampaignStatCard';

describe('It should render campaign Star Card', () => {
  it('should render campaign stat card component', () => {
    const data = {
      totalScheduled: 10,
      totalSent: 10,
      totalClicked: 10
    }
    const container = render(
      <CampaignStatCard data={data} />
    );

    expect(container.queryByTestId('total-scheduled')).toBeInTheDocument();
    expect(container.queryByTestId('total-sent')).toBeInTheDocument();
    expect(container.queryByTestId('click-rate')).toBeInTheDocument();
  });
});

