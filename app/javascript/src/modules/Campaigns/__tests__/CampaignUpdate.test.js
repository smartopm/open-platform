import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import UpdateCampaign from '../containers/CampaignUpdate';

describe('CampaignUpdate Component', () => {
  it('redirects to / and not render campaign update form', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UpdateCampaign match={{ params: { id: '123' } }} />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('campaign-form')).toBeNull();
  });
});
