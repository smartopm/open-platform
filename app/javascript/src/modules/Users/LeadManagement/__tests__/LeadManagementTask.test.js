import React from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import { TaskQuery } from '../../../Tasks/graphql/task_queries';
import LeadManagementTask from '../Components/LeadManagementTask';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('LeadManagementForm', () => {
  const onChange = jest.fn();
  const taskDataMock = [
    {
      request: {
        query: TaskQuery,
        variables: { taskId: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3' }
      },
      result: {
        data: {
          task: {
            id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3',
            body: '',
            createdAt: '',
            completed: false,
            category: '',
            description: '',
            dueDate: '',
            attachments: '',
            formUserId: '',
            status: 'in_progress',
            formUser: {
              id: 'some-id',
              user: {
                id: 'user-id',
                name: 'Form User Name'
              }
            },
            user: {
              id: '5678fgd',
              name: 'Joe',
              imageUrl: ''
            },
            assignees: [
              {
                id: '567age',
                name: 'John',
                imageUrl: '',
                avatarUrl: ''
              }
            ],
            assigneeNotes: [
              {
                id: 'dfghsj8',
                userId: '567dfg',
                reminderTime: ''
              }
            ],
            parentNote: {
              id: 'fghs9',
              body: '',
              formUserId: '12345',
              assignees: [{ id: '34567' }]
            }
          }
        }
      }
    }
  ];

  it('LeadManagementTask component', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={taskDataMock} addTypename={false} fromLeadPage>
          <BrowserRouter>
            <LeadManagementTask
              taskId="6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3"
              handleSplitScreenOpen={onChange}
            />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      screen.debug(undefined, 30000);
      expect(screen.queryAllByTestId('task-title')).toHaveLength(2);
      expect(screen.queryByText('task.parent_task')).toBeInTheDocument();
      expect(screen.queryByText('task.due_date_text')).toBeInTheDocument();
      expect(screen.queryByText('task.date_created')).toBeInTheDocument();
      expect(screen.queryByText('task.parent_task')).toBeInTheDocument();
      expect(screen.queryByText('task.chip_add_assignee')).toBeInTheDocument();
      expect(screen.queryByTestId('add-assignee')).toBeInTheDocument();

      expect(screen.queryByText('John')).toBeInTheDocument();

      expect(screen.queryByText('Sub Tasks')).toBeInTheDocument();
      expect(screen.queryByText('Comments')).toBeInTheDocument();
      expect(screen.queryByText('Documents')).toBeInTheDocument();
      expect(screen.queryByText('Updates')).toBeInTheDocument();

      // simulate user intaraction
      const taskAccordionIcon = screen.queryByTestId('sub-task-accordion-icon');
      expect(taskAccordionIcon).toBeInTheDocument();

      fireEvent.click(taskAccordionIcon);
      const subTaskMenuIcon = screen.queryAllByTestId('menu_item')[0];
      expect(subTaskMenuIcon).toBeInTheDocument();
      fireEvent.click(subTaskMenuIcon);
    }, 20);
  });

  it('LeadManagementTask component with no tasks text', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={taskDataMock} addTypename={false}>
          <BrowserRouter>
            <LeadManagementTask taskId={null} handleSplitScreenOpen={onChange} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText('task.no_tasks')).toBeInTheDocument();
    }, 20);
  });
});
