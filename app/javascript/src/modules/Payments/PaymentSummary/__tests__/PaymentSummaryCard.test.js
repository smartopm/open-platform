import React from 'react';
import { render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import PaymentSummaryCard from '../Components/PaymentSummaryCard';
import currency from '../../../../__mocks__/currency';

describe('Payment Summary card Component', () => {
  it('should render the Payment Summary component', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <PaymentSummaryCard 
            value={910909}
            title='title'
            handleClick={jest.fn()}
            currencyData={currency}
            query="somequery"
          />
        </BrowserRouter>
      </MockedProvider>
    );
    
    expect(container.queryByTestId('card-value')).toBeInTheDocument()
    expect(container.queryByTestId('card-title')).toBeInTheDocument()
  });
});
