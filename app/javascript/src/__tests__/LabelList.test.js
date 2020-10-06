import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { LabelsQuery } from '../graphql/queries'
import Loading from '../components/Loading'
import LabelList from '../components/Label/LabelList'

describe('Label List Component', () => {
  it('should render without error', async () => {
    const mocks = {
      request: {
        query: LabelsQuery
      },
      result: {
        data: {
          labels: [
            {
              id: '2b3f902b-eb44-42a1-b2f3',
              shortDesc: 'com_news_sms',
              users: {
                  id: '34985u639485'
              }
            },
            {
              id: '2b3f902b-eb44-42a1-b2f3',
              shortDesc: 'com_news_email',
              users: {
                  id: '34985u685'
              }
            }
          ]
        }
      }
    }
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <LabelList userType="admin" />
      </MockedProvider>
    )
    const loader = render(<Loading />)
    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()
    await waitFor(() => {
        expect(container.queryByText('Labels')).toBeInTheDocument()
      },
      { timeout: 1000 }
    )
    await waitFor(() => {
        expect(container.queryByText('Description')).toBeInTheDocument()
      },
      { timeout: 1000 }
    )
    await waitFor(() => {
        expect(
          container.queryByText('Total Number of users')
        ).toBeInTheDocument()
      },
      { timeout: 1000 }
    )
    await waitFor(() => {
        expect(
          container.queryByText('com_news_sms')
        ).toBeInTheDocument()
      },
      { timeout: 1000 }
    )
    await waitFor(() => {
        expect(
          container.queryByText('com_news_email')
        ).toBeInTheDocument()
      },
      { timeout: 1000 }
    )
    await waitFor(() => {
        expect(
          container.queryAllByTestId('label-title')
        ).toHaveLength(2)
      },
      { timeout: 1000 }
    )
  })
})
