import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import TransferPlanModal from '../Components/UserTransactions/TransferPlanModal';
import currency from '../../../__mocks__/currency';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('It should test the transfer plan modal component', () => {
  const planData = [{
    amount: 1000,
    id: 'u3290u3u',
    status: 'paid'
  }];

  it('it should render transfer plan modal', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <TransferPlanModal
            open
            handleModalClose={jest.fn}
            userId="4737268hcjek"
            paymentPlanId="j87y3hirj"
            refetch={jest.fn}
            balanceRefetch={jest.fn}
            planData={planData}
            currencyData={currency}
          />
        </MockedProvider>
      </BrowserRouter>
    );
    expect(container.getByTestId('title')).toBeInTheDocument();
    expect(container.getByTestId('plots')).toBeInTheDocument();
  });
});