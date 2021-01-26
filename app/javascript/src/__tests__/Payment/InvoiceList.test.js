import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import InvoiceList from '../../components/Payments/InvoiceList'
import { UserInvoicesQuery } from '../../graphql/queries'
import { Spinner } from '../../shared/Loading'
import { AuthStateProvider } from '../../containers/Provider/AuthStateProvider'
import { generateId } from '../../utils/helpers'

describe('Invoice Item Component', () => {
  it('should render the invoice item component', async () => {
    const userId = generateId()[1]
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
              updatedAt: '2020-12-20' ,
              createdAt: '2020-12-19',
              createdBy: {
                id: '233b1634-bf08-4ece-a213-b3f120a1e009',
                name: 'Some User'
              },
              landParcel: {
                id: '233b1634-bf08-4ece-a213-b3f120a1e009',
                parcelNumber: 'Plot-1343'
              },
            }
          ]
        }
      }
    }

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
              user={user}
            />
          </BrowserRouter>
        </AuthStateProvider>
      </MockedProvider>
    )

    const loader = render(<Spinner />)

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()

    await waitFor(
      () => {
        expect(container.queryByText('k50')).toBeInTheDocument()
        expect(container.queryByText('Updated to Late on 2020-12-20')).toBeInTheDocument()
      },
      { timeout: 100 }
    )
  })
})
