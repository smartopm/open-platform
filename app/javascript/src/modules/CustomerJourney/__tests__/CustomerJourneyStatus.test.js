import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import CustomerJourneyStatus from '../Components/CustomerJourneyStatus';

describe('Customer Journey Status Component', () => {
  it('should render the customer journey status component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <CustomerJourneyStatus subStatus='plots_fully_purchased' />
        </BrowserRouter>
      </MockedProvider>
    );
    
    expect(container.queryByTestId('customer')).toHaveTextContent('Your Customer Journey')
  });
});
