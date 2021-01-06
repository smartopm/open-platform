import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import {
  InvoicesQuery,
  InvoiceStatsQuery,
} from '../../graphql/queries'
import { Spinner } from '../../components/Loading'
import PaymentList from '../../components/Payments/PaymentList'

describe('Invoice Item Component', () => {
  it('should render the invoice item component', async () => {
    const invoiceMock = [
      {
        request: {
          query: InvoicesQuery,
          variables: { status: null, limit: 50, offset: 0 }
        },
        result: {
          data: {
            invoices: [
              {
                id: '299191a9-dece-4ea5-96a2-1e50424fa38a',
                amount: 23423423,
                status: 'in_progress',
                description: 'Final Payment',
                dueDate: '2020-12-31T14:26:00Z',
                user: {
                  id: '162f7517-7cc8-42f9-b2d0-a83a16d59569'
                },
                landParcel: {
                  id: '233b1634-bf08-4ece-a213-b3f120a1e009',
                  parcelNumber: 'Plot-1343'
                },
                payments: []
              },
              {
                id: '19f57fc2-610c-49b8-bc16-1dc239015b58',
                amount: 30,
                status: 'in_progress',
                description: 'Extra payment',
                dueDate: '2020-12-28T22:00:00Z',
                user: {
                  id: '162f7517-7cc8-42f9-b2d0-a83a16d59569'
                },
                landParcel: {
                  id: '50da896a-9217-43b9-a28f-03a13c7d401f',
                  parcelNumber: 'Starter-200'
                },
                payments: []
              }
            ]
          }
        }
      },
      {
        request: {
          query: InvoiceStatsQuery
        },
        result: {
          data: {
            invoiceStats: {
              late: 0,
              paid: 5,
              inProgress: 6,
              cancelled: 2
            }
          }
        }
      }
    ]

    const authState = {
      user: {
        community: {
          currency: 'zambian_kwacha'
        }
      }
    }

    const container = render(
      <MockedProvider mocks={invoiceMock} addTypename={false}>
        <BrowserRouter>
          <PaymentList authState={authState} />
        </BrowserRouter>
      </MockedProvider>
    )

    const loader = render(<Spinner />)

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()

    await waitFor(
      () => {
        expect(container.queryAllByTestId('amount')[0].textContent).toContain(
          'Invoice amount: k23423423'
        )
        expect(container.queryAllByTestId('duedate')[0].textContent).toContain(
          'Due at: 2020-12-31'
        )
        expect(
          container.queryAllByTestId('landparcel')[0].textContent
        ).toContain('Parcel number: Plot-1343')
        expect(container.queryAllByText('Final Payment')[0]).toBeInTheDocument()
        expect(container.queryAllByText('Late')[0]).toBeInTheDocument()
        expect(container.queryAllByText('Paid')[0]).toBeInTheDocument()
        expect(container.queryAllByText('In-Progress')[0]).toBeInTheDocument()
        expect(container.queryAllByText('Cancelled')[0]).toBeInTheDocument()
        expect(container.queryAllByText('5')[0]).toBeInTheDocument()
        expect(container.queryAllByText('6')[0]).toBeInTheDocument()
        expect(container.queryAllByText('2')[0]).toBeInTheDocument()
      },
      { timeout: 500 }
    )
  })
})
