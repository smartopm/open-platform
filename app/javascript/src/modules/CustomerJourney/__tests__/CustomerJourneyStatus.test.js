import React from 'react';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import CustomerJourneyStatus from '../Components/CustomerJourneyStatus';

describe('Customer Journey Status Component', () => {
  it('should render the customer journey status component', () => {
    const container = render(
      <BrowserRouter>
        <CustomerJourneyStatus subStatus='plots_fully_purchased' communityName="Demo" />
      </BrowserRouter>
    );
    
    expect(container.queryByTestId('customer')).toHaveTextContent('dashboard.your_customer_journey')
    expect(container.queryByTestId('customer_steps')).toHaveTextContent('misc.step')
  });
});
