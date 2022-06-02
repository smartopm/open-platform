import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'

import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import SubscriptionPlanModal from '../Components/SubscriptionPlanModal'
import { SubscriptionPlanUpdate } from '../graphql/payment_mutations'

describe('It should test the subscription plan modal component', () => {

  const subscriptionData = {
      id: '68923e9',
      status: 'active',
      planType: "basic",
      startDate: '2021-08-05',
      endDate: '2021-08-15',
      amount: 500
  }

  const handleModalClose = jest.fn()

  it('should render test the subscription plan modal', async () => {
    const mock = [{
      request: {
        query: SubscriptionPlanUpdate,
        variables: {  
          id: subscriptionData.id, 
          status: 'active',
          planType: subscriptionData.planType,
          startDate: subscriptionData.startDate,
          endDate: subscriptionData.endDate,
          amount: subscriptionData.amount
        }
      },
      result: {
        data: {
          subscriptionPlanUpdate: {success: true}
        }
      }
    }];
    const container = render(
      <BrowserRouter>
        <MockedProvider mocks={mock} addTypename={false}>
          <SubscriptionPlanModal
            open
            handleModalClose={handleModalClose}
            setMessage={jest.fn()}
            subscriptionPlansRefetch={jest.fn()}
            openAlertMessage={jest.fn()}
            subscriptionData={subscriptionData}
          />
        </MockedProvider>
      </BrowserRouter>
    )

    expect(container.getByTestId('customDialogcontent')).toBeInTheDocument();
    fireEvent.click(container.getByTestId("custom-dialog-button"))

    await waitFor(
      () => {
        expect(handleModalClose).toBeCalled();
      },
      { timeout: 100 }
    );
  });
});
