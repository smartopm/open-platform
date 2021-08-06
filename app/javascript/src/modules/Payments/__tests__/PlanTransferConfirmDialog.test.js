import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import PlanTransferConfirmModal from '../Components/UserTransactions/PlanTransferConfirmDialog'
import { TransferPaymentPlanMutation } from '../graphql/payment_plan_mutations'

describe('It should test the plan transfer confirm modal component', () => {
  const PaymentData = {
    totalPayment: 2,
    parcelNumber: '1000'
  }

  const transferPaymentPlan = { 
    paymentPlan: {
      id: '68923e9',
      startDate: '2020-10-10',
      landParcel: {
        id: 'y892309',
        parcelNumber: 'BASIC-123',
        parcelType: 'type'
      }
    }
  }

  it('it should render test the plan transfer confirm modal', async () => {
    const mock = [{
      request: {
        query: TransferPaymentPlanMutation,
        variables: {  sourcePlanId: '12345', destinationPlanId: '67890' }
      },
      result: {
        data: {
          transferPaymentPlan
        }
      }
    }];
    const container = render(
      <BrowserRouter>
        <MockedProvider mocks={mock} addTypename={false}>
          <PlanTransferConfirmModal
            open
            handleClose={jest.fn}
            PaymentData={PaymentData}
            paymentPlanId='12345'
            destinationPlanId='67890'
            refetch={jest.fn}
            balanceRefetch={jest.fn}
            handleModal={jest.fn}
          />
        </MockedProvider>
      </BrowserRouter>
    )

    expect(container.getByTestId('content')).toBeInTheDocument();
    fireEvent.click(container.getByTestId("custom-dialog-button"))
  });
});
