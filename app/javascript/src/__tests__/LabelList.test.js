import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import { LabelsQuery } from '../graphql/queries'
import Loading from '../components/Loading'
import LabelList from '../components/Label/LabelList'

describe('Label List Component', () => {
  it('should render without error', async () => {
    const mocks = {
      request: {
        query: LabelsQuery,
        variables: { limit: 50, offset: 0 }
      },
      result: {
        data: {
          labels: [
            {
              id: '2b3f902b-eb44-42a1-b2f3',
              shortDesc: 'com_news_sms',
              color: '#fff',
              description: 'this',
              userCount: 1
            },
            {
              id: '2b3f902b-eb44-42a1-b2f3',
              shortDesc: 'com_news_email',
              color: '#fff',
              description: 'this',
              userCount: 3
            }
          ]
        }
      }
    }
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <BrowserRouter>
          <LabelList userType="admin" />
        </BrowserRouter>
      </MockedProvider>
    )
    const loader = render(<Loading />)
    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()
    await waitFor(() => {
        expect(container.queryByText('Labels')).toBeInTheDocument()
      },
      { timeout: 500 }
    )
    await waitFor(() => {
        expect(container.queryByText('Description')).toBeInTheDocument()
      },
      { timeout: 500 }
    )
    await waitFor(() => {
        expect(
          container.queryByText('Total Number of users')
        ).toBeInTheDocument()
      },
      { timeout: 500 }
    )
    await waitFor(() => {
        expect(
          container.queryByText('com_news_sms')
        ).toBeInTheDocument()
      },
      { timeout: 500 }
    )
    await waitFor(() => {
        expect(
          container.queryByText('com_news_email')
        ).toBeInTheDocument()
      },
      { timeout: 500 }
    )
    await waitFor(() => {
        expect(
          container.queryAllByTestId('label-title')
        ).toHaveLength(2)
      },
      { timeout: 500 }
    )
    await waitFor(() => {
        expect(
          container.queryByTestId('prev-btn')
        ).toHaveTextContent('Previous')
        expect(
          container.queryByTestId('prev-btn')
        ).toBeDisabled()
      },
      { timeout: 500 }
    )

    await waitFor(() => {
        expect(
          container.queryByTestId('next-btn')
        ).toHaveTextContent('Next')
      },
      { timeout: 500 }
    )
  })
})
