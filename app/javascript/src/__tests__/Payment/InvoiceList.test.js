import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import InvoiceList from '../../components/Payments/InvoiceList'
import { UserInvoicesQuery } from '../../graphql/queries'
import { Spinner } from '../../components/Loading'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('Invoice Item Component', () => {
  it('should render the invoice item component', async () => {
    const userId = "162f7517-7cc8-42f9-b2d0-a83a16d59569"
    const invoiceMock = {
      request: {
        query: UserInvoicesQuery,
        variables: { userId, limit: 20, offset: 0 }
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
            },
            {
              id: '95e3c5f3-6757-48c1-837c-1dd3e',
              amount: 500,
              status: 'late',
              description: 'Finale Payment',
              dueDate: '2020-12-28',
              landParcel: {
                id: '233b1634-bf08-4ece-a213-b3f120a1e009',
                parcelNumber: 'Plot-1343'
              },
            },
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
    const container = render(
      <MockedProvider mocks={[invoiceMock]} addTypename={false}>
        <BrowserRouter>
          <InvoiceList userId={userId} data={data} creatorId="939453bef34-f3" />
        </BrowserRouter>
      </MockedProvider>
    )

    const loader = render(<Spinner />)

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()

    await waitFor(
      () => {
        expect(container.queryAllByTestId('amount')[0].textContent).toContain('k50')
        expect(container.queryAllByTestId('duedate')[0].textContent).toContain(
          'due at 2020-12-28'
        )
        expect(container.queryAllByTestId('landparcel')[0].textContent).toContain(
          'Plot-1343'
        )
        expect(container.queryAllByTestId('status')[0].textContent).toContain('Late')
        expect(
          container.queryByText('Final Payment')
        ).toBeInTheDocument()
      },
      { timeout: 500 }
    )
  })
})
