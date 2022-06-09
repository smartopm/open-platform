import React from 'react'
import { render, fireEvent, waitFor, act } from '@testing-library/react'

import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import AllocatePlanModal from '../Components/UserTransactions/AllocatePlanModal'
import { UserLandParcelWithPlan } from '../../../graphql/queries'
import { AllocateGeneralFunds } from '../graphql/payment_plan_mutations';
import { Spinner } from '../../../shared/Loading';

describe('It should test the allocate plan modal component', () => {
  it('should render the allocate plan modal', async () => {
    const mocks = [{
      request: {
        query: UserLandParcelWithPlan,
        variables: {  userId: 'ty2345' }
      },
      result: {
        data: {
          userLandParcelWithPlan: [{
            id: 'et2u32',
            startDate: '2021-11-11',
            pendingBalance: 1000,
            landParcel: {
              id: 'weg2873e2',
              parcelNumber: 'wjedh34'
            }
          }]
        }
      }
    },
    {
      request: {
        query: AllocateGeneralFunds,
        variables: {  paymentPlanId: 'et2u32' }
      },
      result: {
        data: {
          allocateGeneralFunds: {
            success: true
          }
        }
      }
    }
  ];
    const container = render(
      <BrowserRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <AllocatePlanModal
            open
            handleClose={jest.fn}
            userId='ty2345'
            balanceRefetch={jest.fn}
            genRefetch={jest.fn}
            paymentPlansRefetch={jest.fn}
          />
        </MockedProvider>
      </BrowserRouter>
    )

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByTestId('title')).toBeInTheDocument();
        expect(container.queryByTestId('radio-group')).toBeInTheDocument();
        expect(container.queryByTestId('confirmation')).toBeInTheDocument();
        expect(container.queryByTestId('et2u32')).toBeInTheDocument();
        act(() => { fireEvent.click(container.queryByTestId('et2u32')) });
        act(() => { fireEvent.click(container.queryByTestId('confirmation')) });
        act(() => { fireEvent.click(container.queryByTestId('custom-dialog-button')) });
      },10);
  });
});
