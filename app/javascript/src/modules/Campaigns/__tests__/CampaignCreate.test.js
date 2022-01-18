import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import CreateCampaign from '../containers/CampaignCreate';

describe('CampaignCreate Component', () => {
  it('renders loader when loading notes', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <CreateCampaign />
        </BrowserRouter>
      </MockedProvider>
    );
  });
});
