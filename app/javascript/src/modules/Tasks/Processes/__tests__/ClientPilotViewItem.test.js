/* eslint-disable import/prefer-default-export */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import ClientPilotViewItem from '../Components/ClientPilotViewItem';
import taskMock from '../../__mocks__/taskMock';
import authState from '../../../../__mocks__/authstate';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import { ProjectCommentsQuery } from '../graphql/process_queries';

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
    id: '50da896a-9217-43b9-a28f-03a13c7d401f',
    body: 'body',
    createdAt: '2020-12-28T22:00:00Z',
    user: {
      id: '50da896a-9217-43b9-a28f-03a13c7d401f',
      name: 'name',
      imageUrl: 'image.jpg'
    }
  },
];

const projectCommentsMock = [
  {
    request: {
      query: ProjectCommentsQuery,
      variables: { taskId: taskMock.id, limit: 3 }
    },
    result: {
      data: {
        projectComments
      }
    }
  }
];

describe('ClientPilotViewItem Item', () => {
  it('renders necessary elements', async () => {
    render(
      <MockedProvider mocks={projectCommentsMock} addTypename={false}>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <ClientPilotViewItem {...props} />
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
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
