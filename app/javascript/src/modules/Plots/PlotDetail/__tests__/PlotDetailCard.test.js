import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import PlotDetailCard from '../Components/PlotDetailCard';
import { Spinner } from '../../../../shared/Loading';
import { UserPlans } from '../../../Payments/graphql/payment_query';
import MockedThemeProvider from '../../../__mocks__/mock_theme';

describe('Plot Detail Card', () => {
  const authState = {
    id: 'noehr945',
    community: {
      currency: 'zambian_kwacha',
      locale: 'en-ZM'
    }
  };

  const mock = {
    request: {
      query: UserPlans,
      variables: { userId: authState.id }
    },
    result: {
      data: {
        userPlansWithPayments: [
          {
            id: 'f280159d-ac71-4c22-997a-07fd07344c94',
            planType: 'basic',
            startDate: '2021-01-26',
            installmentAmount: '200',
            paymentDay: 1,
            pendingBalance: 200,
            planValue: 300,
            duration: 12,
            frequency: 'monthly',
            status: 'paid',
            endDate: '2021-07-31',
            renewDate: '2021-07-31',
            coOwners: [],
            paidPaymentsExists: null,
            planPayments: null,
            renewable: true,
            landParcel: {
              id: '9283492834912',
              parcelNumber: 'Basic-123',
              parcelType: 'Basic-123',
              objectType: 'Basic-123'
            }
          }
        ]
      }
    }
  };

  it('should render the plot detail card component', async () => {
    const container = render(
      <MockedProvider mocks={[mock]} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <PlotDetailCard authState={authState} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByTestId('plot')).toHaveTextContent('dashboard.plot_detail');
      },
      { timeout: 100 }
    );
  });
});
