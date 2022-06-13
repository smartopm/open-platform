/* eslint-disable import/prefer-default-export */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

import { render, screen, waitFor } from '@testing-library/react';
import ClientPilotViewItem from '../Components/ClientPilotViewItem';
import taskMock from '../../__mocks__/taskMock';
import authState from '../../../../__mocks__/authstate';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import { ProjectCommentsQuery } from '../graphql/process_queries';
import { SubTasksQuery } from '../../graphql/task_queries';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
const props = {
  project: {
    ...taskMock,
    body: 'Project With Comments',
    taskCommentsCount: 1,
    user: {
      ...taskMock.user,
      id: '50da896a-9217-43b9-a28f-03a13c7d401f'
    }
  },
  refetch: jest.fn()
};

const projectComments = [
  {
    __typename: 'Comment',
    id: '50da896a-9217-43b9-a28f-03a13c7d401f',
    body: 'body',
    createdAt: '2020-12-28T22:00:00Z',
    repliedAt: null,
    replyFrom: null,
    replyRequired: false,
    groupingId: null,
    user: {
      __typename: 'User',
      id: '50da896a-9217-43b9-a28f-03a13c7d401f',
      name: 'name',
      imageUrl: 'image.jpg'
    },
    noteId: taskMock.id
  },
];

const projectCommentsMock = {
    request: {
      query: ProjectCommentsQuery,
      variables: { taskId: taskMock.id, limit: 3 }
    },
    result: {
      data: {
        projectComments
      }
    }
  };

const stepsDataMock = {
    request: {
      query: SubTasksQuery,
      variables: { taskId: taskMock.id, limit: taskMock.subTasksCount }
    },
    result: {
      data: {
        taskSubTasks: [
          {
            __typename: 'Note',
            id: '31e883da-a5af-4b56-8870-2db4876ef698',
            body: 'Concept Design Review',
            dueDate: null,
            progress: {
              complete: 0,
              total: 5,
              progress_percentage: 0.0
            },
            subTasksCount: 5,
            taskCommentsCount: 2,
            taskCommentReply: false,
            order: 1,
            completed: false,
            status: 'needs_attention',
            attachments: null,
            formUserId: 'ae4fb514-39eb-49ce-9891-9c5982c37af3',
            submittedBy: {
              __typename: 'User',
              id: 'c8b16e54-095e-4b92-bf51-b197f6b916a6',
              name: 'Bonny Mwenda'
            },
            assignees: [
              {
                __typename: 'Assignee',
                id: 'ccca5372-add6-4377-ba22-1521b5e90b99',
                name: 'Bonny Mwenda',
                imageUrl: 'https://lh3.googleusercontent.com/a-/AOh14GhcavbAGQ-Erhbjo2mQYN3beKduWFyoosNLED0X=s96-c',
                avatarUrl: null
              }
            ],
            subTasks: []
          },
        ]
      }
    }
  };

describe('ClientPilotViewItem Item', () => {
  it('renders necessary elements', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={[projectCommentsMock, stepsDataMock]} addTypename>
          <BrowserRouter>
            <ClientPilotViewItem {...props} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('task-title')).toBeInTheDocument();
      expect(screen.getByTestId('task-title').textContent).toEqual(props.project.body);
      expect(screen.getByTestId('activity-summary-section')).toBeInTheDocument();
      expect(screen.getByTestId('assigned-task-title-header')).toBeInTheDocument();
      expect(screen.getByTestId('project-open-tasks')).toBeInTheDocument();
      expect(screen.queryByText('processes.your_tasks')).toBeInTheDocument();
      expect(screen.getByTestId('project-step-information')).toBeInTheDocument();
      expect(screen.queryByText('processes.process_steps')).toBeInTheDocument();

      // other card elements
      expect(screen.getByTestId('process-check-box')).toBeInTheDocument();
      expect(screen.getByTestId('step_body')).toBeInTheDocument();
      expect(screen.getByTestId('menu_list')).toBeInTheDocument();
    }, 10)
  });
});
