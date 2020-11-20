import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import ActionFlows from '../containers/ActionFlows/ActionFlows'
import { Flows } from '../graphql/queries'
import Loading from '../components/Loading'
import '@testing-library/jest-dom/extend-expect'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('ActionFlows', () => {
  it('renders necessary elements', async () => {
    const mocks = {
      request: {
        query: Flows,
        variables: { limit: 10, offset: 0 }
      },
      result: {
        data: {
          actionFlows: [
            {
              id: '543323432432',
              description: 'Some description',
              title: 'A flow',
              eventType: 'task_update',
              eventCondition: '',
              eventConditionQuery: '',
              eventAction: 'email',
              actionType: '',
              createdAt: '2020-06-25T11:58:22.573Z',
              active: true,
              __typename: 'ActionFlows'
            }
          ]
        }
      }
    }

    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <BrowserRouter>
          <ActionFlows />
        </BrowserRouter>
      </MockedProvider>
    )

    const loader = render(<Loading />)
    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()

    await waitFor(
      () => expect(container.queryByText('New Workflow')).toBeInTheDocument(),
      { timeout: 1000 }
    )

    const newFlow = container.queryByText('New Workflow')

    fireEvent.click(newFlow)

    expect(container.queryByText('Title')).toBeInTheDocument()
    expect(container.queryByText('Description')).toBeInTheDocument()
    expect(container.queryByText('Cancel')).toBeInTheDocument()
    expect(container.queryByText('Save')).toBeInTheDocument()
  })
})
