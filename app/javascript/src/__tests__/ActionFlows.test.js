import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import ActionFlows from '../containers/ActionFlows/ActionFlows'
import { Flows } from '../graphql/queries'
import Loading from '../shared/Loading'

import MockedThemeProvider from '../modules/__mocks__/mock_theme'
import { Context } from '../containers/Provider/AuthStateProvider'
import userMock from '../__mocks__/userMock'
import MockedSnackbarProvider from '../modules/__mocks__/mock_snackbar'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
const mocks = {
  request: {
    query: Flows,
    variables: { limit: 10, offset: 0 }
  },
  result: {
    data: {
      actionFlows: [
        {
          id: '54332342432',
          description: 'Some description',
          title: 'A flow',
          eventType: 'task_update',
          eventCondition: '',
          eventConditionQuery: '',
          eventAction: 'email',
          actionType: '',
          createdAt: '2020-06-25T11:58:22.573Z',
          __typename: 'ActionFlows'
        }
      ]
    }
  }
}
describe('ActionFlows', () => {
  it('renders necessary elements', async () => {
    const container = render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={[mocks]} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <ActionFlows />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    )

    const loader = render(<Loading />)
    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()

    await waitFor(
      () => expect(container.queryByText('actionflow:form_actions.new_workflow')).toBeInTheDocument(),
      { timeout: 10 }
    )

    const newFlow = container.queryByText('actionflow:form_actions.new_workflow')

    fireEvent.click(newFlow)

    expect(container.queryByText('common:form_fields.title')).toBeInTheDocument()
    expect(container.queryByText('common:form_fields.description')).toBeInTheDocument()
    expect(container.queryByText('common:form_actions.cancel')).toBeInTheDocument()
    expect(container.queryByText('common:form_actions.save')).toBeInTheDocument()
  })

  it('renders no-workflow found if nothing is fetched', async () => {
    const newMocks = {
      request: {
        query: Flows,
        variables: { limit: 10, offset: 0 }
      },
      result: {
        data: {
          actionFlows: []
        }
      }
    }
    const container = render(
      <MockedProvider mocks={[newMocks]} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <MockedSnackbarProvider>
              <ActionFlows />
            </MockedSnackbarProvider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    )

    await waitFor(
      () => expect(container.queryByText('actionflow:messages.workflow_not_found')).toBeInTheDocument(),
      { timeout: 10 }
    )
  })
})
