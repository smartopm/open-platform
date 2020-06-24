import React from 'react'
import Campaign from '../components/CampaignList'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import { allCampaigns } from '../graphql/queries'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'

describe('Campaign List page', () => {
  it('should render without error', async () => {
    const mocks = [
      {
        request: {
          query: allCampaigns,
        },
        result: {
          data: {
            campaigns: [{
              id: '54343432432',
              batchTime: '2020-06-24T11:58:22.573Z',
              communityId: '34324234',
              createdAt: '2020-06-24T11:58:22.573Z',
              endTime: '2020-07-24T11:58:22.573Z',
              message: 'This is a campaign message',
              name: 'Important',
              startTime: '2020-06-24T11:58:22.573Z',
              updatedAt: '2020-06-25T11:58:22.573Z',
              userIdList: 'bsufsbdf343, 53094549035, 09u4093',
            }],
          },
        },
      },
    ]
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <Campaign />
        </BrowserRouter>
      </MockedProvider>
    )
    const loader = render(<Loading />)
    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()

    await waitFor(() => expect(container.queryByTestId('c_message')).toHaveTextContent('This is a campaign message'), { timeout: 1000 })
    await waitFor(() => expect(container.queryByTestId('c_name')).toHaveTextContent('Important'), { timeout: 1000 })
    await waitFor(() => {
      const btn = container.queryByTestId('more_details_btn')
      expect(btn).toHaveTextContent('More Details')
    }, { timeout: 1000 }
    )

  })
  it('should render with an error', () => {
    const err = 'oops something went wrong'
    const mocks = [
      {
        request: {
          query: allCampaigns,
        },
        result: {
          data: {
            campaigns: {
              id: '54343432432',
              batchTime: '2020-06-24T11:58:22.573Z',
              communityId: '34324234',
              createdAt: '2020-06-24T11:58:22.573Z',
              endTime: '2020-07-24T11:58:22.573Z',
              message: 'This is a campaign message'
            },
          },
        },
        error: new Error(err),
      },
    ]
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <Campaign />
        </BrowserRouter>
      </MockedProvider>
    )
    const ErrorC = render(
      <BrowserRouter>
        <ErrorPage title={err} />
      </BrowserRouter>
    )
    expect(ErrorC.queryAllByText('Home')[0]).toBeInTheDocument()
    expect(ErrorC.queryAllByText(err)[0]).toBeInTheDocument()
  })
})
