import React from 'react';
import { act, render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import ActionFlowModal from '../containers/ActionFlows/ActionFlowModal';
import { Events, Actions, ActionFields, RuleFields , UsersLiteQuery } from '../graphql/queries';
import { EmailTemplatesQuery } from '../modules/Emails/graphql/email_queries';


import '@testing-library/jest-dom/extend-expect';
import MockedThemeProvider from '../modules/__mocks__/mock_theme';
import { Context } from '../containers/Provider/AuthStateProvider';
import userMock from '../__mocks__/userMock';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
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
    },
    eventType: 'task_update',
    actionType: 'notification'
  }
};
describe('ActionFlowModal', () => {
  it('renders "Edit Workflow" and "Save Changes" and other necessary elements', async () => {
    let container;
    await act(async () => {
      container = render(
        <Context.Provider value={userMock}>
          <MockedProvider mocks={[]} addTypename={false}>
            <BrowserRouter>
              <MockedThemeProvider>
                <ActionFlowModal {...props} />
              </MockedThemeProvider>
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      );
    });

    expect(container.queryByText('Edit Workflow')).toBeInTheDocument();
    expect(container.queryByText('Title')).toBeInTheDocument();
    expect(container.queryByText('Description')).toBeInTheDocument();
    expect(container.queryByText('Cancel')).toBeInTheDocument();
    expect(container.queryByText('Save Changes')).toBeInTheDocument();
    expect(container.queryByText('New Workflow')).toBeNull();
    expect(container.queryByText('Save')).toBeNull();
  });

  it('renders "New Workflow" and "Save" and other necessary elements', async () => {
    const updatedProps = {
      ...props,
      selectedActionFlow: {}
    };
    let container;
    await act(async () => {
      container = render(
        <Context.Provider value={userMock}>
          <MockedProvider mocks={[]} addTypename={false}>
            <BrowserRouter>
              <MockedThemeProvider>
                <ActionFlowModal {...updatedProps} />
              </MockedThemeProvider>
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      );
    });

    expect(container.queryByText('Edit Workflow')).toBeNull();
    expect(container.queryByText('Title')).toBeInTheDocument();
    expect(container.queryByText('Description')).toBeInTheDocument();
    expect(container.queryByText('Cancel')).toBeInTheDocument();
    expect(container.queryByText('Save')).toBeInTheDocument();
    expect(container.queryByText('Save Changes')).toBeNull();
    expect(container.queryByText('New Workflow')).toBeInTheDocument();
  });
});

describe('render eventType, actionTypes, actionFields, ruleFields', () => {
  const mocks = [
    {
      request: {
        query: Events,
        variables: {}
      },
      result: {
        data: {
          events: [
            'task_update',
            'note_comment_create',
            'form_update_submit',
            'user_login',
            'form_submit',
            'note_comment_update',
            'deposit_create',
            'invoice_change'
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
            { name: 'label', type: 'select' },
            { name: 'category', type: 'select' },
            { name: 'assignees', type: 'select' },
            { name: 'template', type: 'select' },
            { name: 'due_date', type: 'date' },
            { name: 'user_id', type: 'text' },
            { name: 'message', type: 'text' }
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
            'note_id',
            'note_user_id',
            'note_author_id',
            'note_body',
            'note_assignees_emails',
            'note_url',
            'deposit_status',
            'invoice_current_status'
          ]
        }
      }
    },
    {
      request: {
        query: EmailTemplatesQuery
      },
      result: {
        data: {
          emailTemplates: [
            {
              id: '1234',
              name: 'My Template',
              variableNames: ['url']
            }
          ]
        }
      }
    },
    {
      request: {
        query: UsersLiteQuery
      },
      result: {
        data: {
          usersLite: [
            {
              id: '1234',
              name: 'A user name'
            }
          ]
        }
      }
    }
  ];

  it('should display element to customize action flow', async () => {
    await act(async () => {
      render(
        <Context.Provider value={userMock}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <MockedThemeProvider>
              <ActionFlowModal {...props} />
            </MockedThemeProvider>
          </MockedProvider>
        </Context.Provider>
      );
    });
  });

  it('should render email templates options', async () => {
    const newProps = { ...props, actionType: 'custom_email' };

    await act(async () => {
      render(
        <Context.Provider value={userMock}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <MockedThemeProvider>
              <ActionFlowModal {...newProps} />
            </MockedThemeProvider>
          </MockedProvider>
        </Context.Provider>
      );
    });
  });
});
