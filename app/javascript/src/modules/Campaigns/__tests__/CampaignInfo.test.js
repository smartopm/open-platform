import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CampaignInfo from '../components/CampaignInfo';

describe('It should render campaign Info', () => {
  it('should render campaign info component', () => {
    const container = render(
      <CampaignInfo title='sample-title' buttonText='sample-text' handleClick={jest.fn()} />
    );

    expect(container.queryByTestId('title')).toHaveTextContent('sample-title');
    expect(container.queryByTestId('button')).toHaveTextContent('sample-text');
  });
});