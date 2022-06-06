import React from 'react';
import { render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import PlanDetail from '../Components/UserTransactions/PlanDetail';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('It should test the plan detail modal component', () => {
  const planData = {
    id: '84h3ui7ehf',
    planType: 'basic',
    startDate: '2020-12-12',
    installmentAmount: 100,
    planValue: 200,
    duration: 12,
    status: 'active',
    endDate: '2020-12-12',
    user: {
      name: 'some name'
    },
    landParcel: {
      parcelNumber: 'test123'
    }
  };

  it('should render plan detail modal', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <PlanDetail
              open
              handleModalClose={jest.fn}
              currencyData={{ currency: 'ZMW', locale: 'en-ZM' }}
              planData={planData}
              updatePaymentPlan={jest.fn}
              setIsSuccessAlert={jest.fn}
              setMessageAlert={jest.fn}
              plansRefetch={jest.fn}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.getByTestId('detail')).toBeInTheDocument();
    expect(container.getByTestId('status')).toBeInTheDocument();
    expect(container.getByTestId('start-date')).toBeInTheDocument();
    expect(container.getByTestId('end-date')).toBeInTheDocument();
    expect(container.getByTestId('payment-day')).toBeInTheDocument();
    expect(container.getByTestId('renewable-slider')).toBeInTheDocument();
    expect(container.getByTestId('renewable-text')).toBeInTheDocument();
  });
});
