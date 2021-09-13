import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { Spinner } from '../../../shared/Loading';
import { PlansList, SubscriptionPlans, renderSubscriptionPlans} from '../Components/PlansList';
import currency from '../../../__mocks__/currency';

describe('Plans List Item Component', () => {
  const subscriptionPlansData = {
    subscriptionPlans: [
      {
        amount: 100000,
        status: 'active',
        startDate: '2021-06-04',
        endDate: '2022-06-04',
        planType: 'basic',
        id: '5d0d8051-2510-567a-886a-48bbfa9f6414'
      }
    ]
  };

  const communityPlans = [
    {
      status: 'active',
      startDate: '2021-06-04',
      endDate: '2022-06-04',
      planType: 'basic',
      id: '5d0d8051-2510-567a-886a-48bbfa9f6414',
      totalPayments: 500.0,
      expectedPayments: 600.0,
      owingAmount: 100.0,
      installmentsDue: 1,
      user: {
        id: '5d0d8051-2510-567a-886a-48bbfa9f6423',
        name: 'John Doe',
        imageUrl: 'http://host.com/image.jpg'
      },
      landParcel: {
        parcelNumber: 'Plot01'
      }
    }
  ]
  it('should render the plans list component', async () => {
    render(
      <BrowserRouter>
        <PlansList
          currencyData={currency}
          matches={false}
          communityPlansLoading={false}
          communityPlans={communityPlans}
          setDisplaySubscriptionPlans={jest.fn}
        />
      </BrowserRouter>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
  });

  it('should render the subscription plans component', async () => {
    render(
      <BrowserRouter>
        <SubscriptionPlans
          currencyData={currency}
          matches={false}
          setMessage={jest.fn}
          setAlertOpen={jest.fn}
          subscriptionPlansLoading={false}
          subscriptionPlansData={subscriptionPlansData}
          subscriptionPlansRefetch={jest.fn}
          setDisplaySubscriptionPlans={jest.fn}
        />
      </BrowserRouter>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
  });

  it('should check if renderSubscriptionPlans works as expected', () => {
    const menuData = {
      menuList: [{ content: 'Edit subscription plan', isAdmin: true, color: '', handleClick: jest.fn()}],
      handleTransactionMenu: jest.fn(),
      anchorEl: null,
      open: true,
      userType: 'admin',
      handleClose: jest.fn()
    }
    const results = renderSubscriptionPlans(subscriptionPlansData.subscriptionPlans[0], currency, menuData);
    expect(results).toBeInstanceOf(Array);
    expect(results[0]).toHaveProperty('Plan Type');
    expect(results[0]).toHaveProperty('Start Date');
    expect(results[0]).toHaveProperty('End Date');
    expect(results[0]).toHaveProperty('Amount');
    expect(results[0]).toHaveProperty('Status');
  });
});
