import React from 'react';
import { render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import CustomerJourneyStatusBar from '../Components/CustomerJourneyStatusBar';

describe('Customer Journey Status Component', () => {
  it('should render the customer journey status component', () => {
    const indexValue = 1
    const barCount = 2

    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <CustomerJourneyStatusBar coloured indexValue={indexValue} barCount={barCount} />
        </BrowserRouter>
      </MockedProvider>
    );
    
    expect(container.queryByTestId('bar')).toBeInTheDocument()
  });
});