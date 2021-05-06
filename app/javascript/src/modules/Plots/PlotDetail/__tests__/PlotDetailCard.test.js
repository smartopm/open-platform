import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import PlotDetailCard from '../Components/PlotDetailCard';
import { PaymentPlan } from '../graphql/plot_detail_query';
import { Spinner } from '../../../../shared/Loading';

describe('Plot Detail Card', () => {
  const authState = {
    id: 'noehr945',
    community: {
      currency: 'zambian_kwacha', 
      locale: 'en-ZM'
    }
  }

  const mock = {
    request: {
      query: PaymentPlan,
      variables: {
        userId: 'noehr945'
      }
    },
    result: {
      data: {
        paymentPlan:
          [{
            id: 'ykwe394oh3',
            plotBalance: 200,
            landParcel: {
              id: '834jdh3',
              parcelNumber: 'test123'
            },
            invoices: [
              {
                id: 'hiue8u398re',
                invoiceNumber: '133404',
                dueDate: '2021-02-02T10:13:21Z'
              }
            ]
          }]
      }
    }
  }

  it('should render the plot detail card component', async () => {
    const container = render(
      <MockedProvider mocks={[mock]} addTypename={false}>
        <BrowserRouter>
          <PlotDetailCard authState={authState} />
        </BrowserRouter>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByTestId('plot')).toHaveTextContent('dashboard.plot_detail')
      },
      { timeout: 100 }
    );
  });
});