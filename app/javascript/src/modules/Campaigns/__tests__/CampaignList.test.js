import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import { allCampaigns } from '../../../graphql/queries'
import Campaign from '../components/CampaignList'
import Loading from '../../../shared/Loading'
import ErrorPage from '../../../components/Error'

describe('Campaign List page', () => {
  it('should render without error', async () => {
    const mocks = {
      request: {
        query: allCampaigns,
        variables: { limit: 50, offset: 0 }
      },
      result: {
        data: {
          campaigns: [{
            id: '54343432432',
            batchTime: '2020-06-24T11:58:22.573Z',
            status: 'draft',
            communityId: '34324234',
            createdAt: '2020-06-24T11:58:22.573Z',
            endTime: '2020-07-24T11:58:22.573Z',
            message: 'This is a campaign message',
            name: 'Important',
            startTime: '2020-06-24T11:58:22.573Z',
            updatedAt: '2020-06-25T11:58:22.573Z',
            userIdList: 'bsufsbdf343, 53094549035, 09u4093',
            campaignMetrics: {
              batchTime: "2020-05-20T05:35:03Z",
              startTime: "2020-05-20T05:36:35Z",
              endTime: "2020-05-20T05:36:36Z",
              totalScheduled: "1",
              totalSent: "1",
              totalClicked: "0"
            },
            __typename: "Campaign",
          }],
        },
      },
    }
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <BrowserRouter>
          <Campaign />
        </BrowserRouter>
      </MockedProvider>
    )
    const loader = render(<Loading />)
    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()

    await waitFor(() => expect(container.queryByTestId('c_message')).toHaveTextContent('This is a campaign message'), { timeout: 10 })
    await waitFor(() => expect(container.queryByTestId('c_name')).toHaveTextContent('Important'), { timeout: 10 })
    await waitFor(() => {
      const btn = container.queryByTestId('more_details_btn')
      expect(btn).toHaveTextContent('campaign.more_details')
    }, { timeout: 10 }
    )
  })
  // TODO: Improve this test
  it('should render with an error', async () => {
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
    await waitFor(() => {
      expect(ErrorC.queryAllByText('Home')[0]).toBeInTheDocument()
      expect(ErrorC.queryAllByText(err)[0]).toBeInTheDocument()
    }, 10)
  })
})
