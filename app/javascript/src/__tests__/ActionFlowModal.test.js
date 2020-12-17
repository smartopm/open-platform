import React from 'react'
import { act, render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import ActionFlowModal from '../containers/ActionFlows/ActionFlowModal'
import { Events, Actions, ActionFields, RuleFields } from '../graphql/queries'

import '@testing-library/jest-dom/extend-expect'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
const props = {
  open: true,
  closeModal: jest.fn(),
  handleSave: jest.fn(),
  selectedActionFlow: {
    id: 'uuid12345',
    eventAction: {
      action_fields: {
        email: {
          name: 'email',
          value: 'email@gmail.com',
          type: 'string'
        }
      }
    }
  }
}
describe('ActionFlowModal', () => {
  it('renders "Edit Workflow" and "Save Changes" and other necessary elements', () => {
    const container = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <ActionFlowModal {...props} />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByText('Edit Workflow')).toBeInTheDocument()
    expect(container.queryByText('Title')).toBeInTheDocument()
    expect(container.queryByText('Description')).toBeInTheDocument()
    expect(container.queryByText('Cancel')).toBeInTheDocument()
    expect(container.queryByText('Save Changes')).toBeInTheDocument()
    expect(container.queryByText('New Workflow')).toBeNull()
    expect(container.queryByText('Save')).toBeNull()
  })

  it('renders "New Workflow" and "Save" and other necessary elements', () => {
    const updatedProps = {
      ...props,
      selectedActionFlow: {}
    }
    const container = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <ActionFlowModal {...updatedProps} />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByText('Edit Workflow')).toBeNull()
    expect(container.queryByText('Title')).toBeInTheDocument()
    expect(container.queryByText('Description')).toBeInTheDocument()
    expect(container.queryByText('Cancel')).toBeInTheDocument()
    expect(container.queryByText('Save')).toBeInTheDocument()
    expect(container.queryByText('Save Changes')).toBeNull()
    expect(container.queryByText('New Workflow')).toBeInTheDocument()
  })
})

describe('render eventType, actionTypes, actionFields, ruleFields', () => {
  const newProps = {
    ...props,
    selectedActionFlow: {}
  }
  const mocks = [
    {
      request: {
        query: Events,
        variables: {}
      },
      result: {
        data: {
          events: [
            "task_update",
            "note_comment_create",
            "form_update_submit",
            "user_login",
            "form_submit",
            "note_comment_update"
          ]
        }
      }
    },
    {
      request: {
        query: Actions,
        variables: {}
      },
      result: {
        data: {
          actions: ['Email', 'Notification', 'Task']
        }
      }
    }, 
    {
      request: {
        query: ActionFields,
        variables: {
          action: 'notification'
        }
      },
      result: {
        data: {
          actionFields: [
            {name: "label", type: "select"},
            {name: "user_id", type: "text"},
            {name: "message", type: "text"}
          ]
        }
      }
    },
    {
      request: {
        query: RuleFields,
        variables: {
          eventType: 'task_update'
        }
      },
      result: {
        data: {
          ruleFields: [
            "note_id",
            "note_user_id",
            "note_author_id",
            "note_body",
            "note_assignees_emails",
            "note_url"
          ]
        }
      }
    }
  ]

  it('should display element to customize action flow', async () => {
    let container;
    await act(async () => {
      container = render(
        <MockedProvider
          mocks={mocks}
          addTypename={false}
        >
          <ActionFlowModal {...newProps} />
        </MockedProvider>
      )
    })

    const eventTypeSelector = container.queryByTestId('select-event-type')
    expect(eventTypeSelector).toBeTruthy()
    const actionTypeSelector = container.queryByTestId('select-action-type')
    expect(actionTypeSelector).toBeTruthy()
  });
});