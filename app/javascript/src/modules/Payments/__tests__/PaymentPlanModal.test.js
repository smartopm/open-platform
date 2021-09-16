import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import PaymentPlanModal, {CoOwners} from '../Components/UserTransactions/PaymentPlanModal';
import userMock from '../../../__mocks__/userMock';
import { PaymentPlanCreateMutation } from '../../../graphql/mutations/land_parcel';
import { Spinner } from '../../../shared/Loading';

describe('It should test the payment plan modal component', () => {
  const mock = [{
    request: {
      query: PaymentPlanCreateMutation,
      variables: {
        userId: "hdkhadsudvvxx",
        landParcelId: "klifasnd-94ff",
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
  }];

  it('it should render payment modal', async () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider mocks={mock}>
          <PaymentPlanModal
            open
            handleModalClose={jest.fn}
            userData={userMock.user}
          />
        </MockedProvider>
      </BrowserRouter>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
    expect(container.queryByText('table_headers.owner')).toBeInTheDocument();
    expect(container.queryByText('common:table_headers.start_date')).toBeInTheDocument();
    expect(container.queryByText('common:misc.plan_frequency')).toBeInTheDocument();
    expect(container.queryByText('table_headers.plan_duration')).toBeInTheDocument();
    expect(container.queryByText('common:table_headers.amount')).toBeInTheDocument();
    expect(container.queryByText('common:table_headers.status')).toBeInTheDocument();
    expect(container.queryByText('table_headers.plan_type')).toBeInTheDocument();
    expect(container.queryByText('misc.renewable')).toBeInTheDocument();
    expect(container.queryByText('table_headers.select_plot')).toBeInTheDocument();
  });
});

describe('It should test the CoOwners component', () => {
  const landParcel = {
    id: "sdadkjalkhdash",
    parcelNumber: "Plot01",
    accounts: [
      {
        userId: 'hdkhadsudvvxx',
        fullName: 'John Doe'
      }
    ]
  };

  it('should render the CoOwners component', async() => {
    render(
      <BrowserRouter>
        <CoOwners
          landParcel={landParcel}
          userId='jhouytre-09uol'
          handleCoOwners={jest.fn}
        />
      </BrowserRouter>
    );
  });
});
