import React from 'react';
import { render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import PaymentPlanModal, { CoOwners } from '../Components/UserTransactions/PaymentPlanModal';
import userMock from '../../../__mocks__/authstate';
import { PaymentPlanCreateMutation } from '../../../graphql/mutations/land_parcel';
import { Spinner } from '../../../shared/Loading';
import { mockedSnackbarProviderProps } from '../../__mocks__/mock_snackbar';

describe('It should test the payment plan modal component', () => {
  const mock = [
    {
      request: {
        query: PaymentPlanCreateMutation,
        variables: {
          userId: 'hdkhadsudvvxx',
          landParcelId: 'klifasnd-94ff',
          coOwnerIds: [],
          status: 'active',
          planType: 'starter',
          startDate: '08-08-2020',
          installmentAmount: 100.0,
          totalAmount: 1200.0,
          duration: 12,
          frequency: 'monthly',
          renewable: true
        }
      }
    }
  ];

  it('should render payment modal', async () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider mocks={mock}>
          <PaymentPlanModal
            open
            handleModalClose={jest.fn()}
            userData={userMock.user}
            userId={userMock.user.id}
            currency="kd"
            balanceRefetch={jest.fn()}
            showSnackbar={jest.fn()}
            messageType={{...mockedSnackbarProviderProps.messageType}}
          />
        </MockedProvider>
      </BrowserRouter>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
    expect(container.queryAllByText('table_headers.owner')[0]).toBeInTheDocument();
    expect(container.queryAllByText('common:table_headers.start_date')[0]).toBeInTheDocument();
    expect(container.queryAllByText('common:misc.plan_frequency')[0]).toBeInTheDocument();
    expect(container.queryAllByText('table_headers.plan_duration')[0]).toBeInTheDocument();
    expect(container.queryByText('common:table_headers.amount')).toBeInTheDocument();
    expect(container.queryByText('common:table_headers.status')).toBeInTheDocument();
    expect(container.queryByText('table_headers.plan_type')).toBeInTheDocument();
    expect(container.queryByText('misc.renewable')).toBeInTheDocument();
    expect(container.queryByText('table_headers.select_plot')).toBeInTheDocument();
  });
});

describe('It should test the CoOwners component', () => {
  const landParcel = {
    id: 'sdadkjalkhdash',
    parcelNumber: 'Plot01',
    accounts: [
      {
        userId: 'hdkhadsudvvxx',
        fullName: 'John Doe'
      }
    ]
  };

  it('should render the CoOwners component', async () => {
    const container = render(
      <BrowserRouter>
        <CoOwners
          landParcel={landParcel}
          userId="jhouytre-09uol"
          handleCoOwners={jest.fn()}
          coOwnersIds={[]}
        />
      </BrowserRouter>
    );

    expect(container.queryByTestId('form-label')).toBeInTheDocument();
    expect(container.queryByText('John Doe')).toBeInTheDocument();
  });
});
