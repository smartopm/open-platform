import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import InvoiceList from '../../components/Payments/InvoiceList'
import { UserInvoicesQuery } from '../../graphql/queries'
import { Spinner } from '../../components/Loading'
import { AuthStateProvider } from '../../containers/Provider/AuthStateProvider'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('Invoice Item Component', () => {
  it('should render the invoice item component', async () => {
    const userId = "162f7517-7cc8-42f9-b2d0-a83a16d59569"
    const invoiceMock = {
      request: {
        query: UserInvoicesQuery,
        variables: { userId, limit: 15, offset: 0 }
      },
      result: {
        data: {
          userInvoices: [
            {
              id: '95e3c5f3-6757-48c1-837c-1d3e',
              amount: 50,
              status: 'late',
              description: 'Final Payment',
              dueDate: '2020-12-28',
              landParcel: {
                id: '233b1634-bf08-4ece-a213-b3f120a1e009',
                parcelNumber: 'Plot-1343'
              },
              payments: [
                {
                  id: '233b1634-bf08-4ece-a213-b3f120a1e009',
                  amount: 1000,
                  paymentType: 'cash',
                  paymentStatus: 'settled',
                  user: {
                    id: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
                    name: 'tolulope'
                  }
                }
              ]
            }
          ]
        }
      }
    }
    const data = [
      {
        id: '3429hdisu34',
        parcelNumber: 'ho2ij3'
      }
    ]

    const user = {
      id: "939453bef34-f3",
      community: {
        currency: "zambian_kwacha"
      }
    }

    const container = render(
      <MockedProvider mocks={[invoiceMock]} addTypename={false}>
        <AuthStateProvider>
          <BrowserRouter>
            <InvoiceList
              userId={userId}
              data={data}
              user={user}
              userType='admin'
            />
          </BrowserRouter>
        </AuthStateProvider>
      </MockedProvider>
    )

    const loader = render(<Spinner />)

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()

    await waitFor(
      () => {
        expect(container.queryAllByTestId('amount')[0].textContent).toContain('Invoice amount: k50')
        expect(container.queryAllByTestId('duedate')[0].textContent).toContain(
          'Due at: 2020-12-28'
        )
        expect(container.queryAllByTestId('landparcel')[0].textContent).toContain(
          'Parcel number: Plot-1343'
        )
        expect(
          container.queryByText('Final Payment')
        ).toBeInTheDocument()
        expect(container.queryAllByTestId('pay-button')).toBeTruthy()
      },
      { timeout: 500 }
    )
  })
})
