import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import { EntryRequestQuery } from '../graphql/queries'
import Loading from '../components/Loading'
import RequestUpdate from '../components/Request/RequestUpdate'

describe("RequestUpdate Component ",() => {
  const mocks = {
    request: {
      query: EntryRequestQuery,
      variables: { id: '3c2f8ee2-598b-437c-b217-3e4c0f86c761' }
    },
    result: {
      data: {
        entryRequest: {
          id: "3c2f8ee2-598b-437c-b217-3e4c0f86c761",
          name: "A new name",
          phoneNumber: "309475834",
          nrc: "37348u53",
          vehiclePlate: null,
          reason: "Prospective Client",
          otherReason: null,
          concernFlag: null,
          grantedState: 1,
          createdAt: "2020-10-15T09:31:02Z",
          updatedAt: "2020-10-15T09:31:06Z",
          grantedAt: "2020-10-15T09:31:06Z",
          user: {
            name: "Some User Name",
            id: "162f7517-7cc8-42f9-b2d0-a83a16d59569"
          }
        }
      }
    }
  }
  it('should render RequestUpdate page without error', async () => {
     const container =  render(
       <MockedProvider mocks={[mocks]} addTypename={false}>
         <BrowserRouter>
           <RequestUpdate id="3c2f8ee2-598b-437c-b217-3e4c0f86c761" />
         </BrowserRouter>
       </MockedProvider>
     )
    expect(container.getByTestId('loader')).toBeInTheDocument()
    const loader = render(<Loading />)
    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()

    await waitFor(() => {
        expect(container.queryByText('NAME')).toBeInTheDocument()
      },
      { timeout: 500 }
    )
    await waitFor(() => {
      const entryName = container.queryByTestId('entry_user_name')
      fireEvent.change(entryName, { target: { value: 'Some User Nam' } })
      expect(entryName.value).toBe('Some User Nam')
      
      fireEvent.change(container.queryByTestId('entry_user_nrc'), { target: { value: '100100/10/1' } })
      expect(container.queryByTestId('entry_user_nrc').value).toBe('100100/10/1')

      fireEvent.change(container.queryByTestId('entry_user_phone'), { target: { value: '100100' } })
      expect(container.queryByTestId('entry_user_phone').value).toBe('100100')
  
      fireEvent.change(container.queryByTestId('entry_user_vehicle'), { target: { value: 'ABT' } })
      expect(container.queryByTestId('entry_user_vehicle').value).toBe('ABT')
      expect(container.queryByTestId('entry_user_grant').textContent).toContain('Grant')
      expect(container.queryByTestId('entry_user_grant')).not.toBeDisabled()
      expect(container.queryByTestId('entry_user_deny').textContent).toContain('Deny')
      expect(container.queryByTestId('entry_user_deny')).not.toBeDisabled()
      expect(container.queryByTestId('entry_user_call_mgr').textContent).toContain('Call Poniso')

        },
        { timeout: 500 }
      )

  })
})
