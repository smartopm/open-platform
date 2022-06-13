import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

import { render, screen, waitFor } from '@testing-library/react';
import routeData from 'react-router';
import authState from '../../../../__mocks__/authstate';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import { ProjectCommentsQuery } from '../graphql/process_queries';
import ProjectActivitySummary from '../Components/ProjectActivitySummary';

describe('Activity Summary', () => {
  const taskMock = {
    id: '50da896a-9217-43b9-a28f-03a13c7d401f'
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useParams').mockReturnValue(taskMock);
  });

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
    {
      id: "947bbb87-b3ec-4aa9-90ee-1f2f33fc2d75",
      body: "Step 2 comment",
      createdAt: "2022-01-07T11:40:36+02:00",
      user: {
          id: "bdf23d62-071c-4fdf-8ee5-7add18236090",
          name: "name",
          "imageUrl": "image2.jpg"
      }
    },
    {
      id: "18fa2e12-644d-4227-af93-fddb6c58271e",
      body: "Subtask 2 comment",
      createdAt: "2022-01-07T11:38:48+02:00",
      user: {
          id: "bdf23d62-071c-4fdf-8ee5-7add18236090",
          name: "name",
          imageUrl: "image3.jpg"
      }
    }
  ];

  const projectCommentsMock = [
    {
      request: {
        query: ProjectCommentsQuery,
        variables: { taskId: '50da896a-9217-43b9-a28f-03a13c7d401f', limit: 3 }
      },
      result: {
        data: {
          projectComments
        }
      }
    }
  ];

  const emptyProjectCommentsMock = [
    {
      request: {
        query: ProjectCommentsQuery,
        variables: { taskId: '50da896a-9217-43b9-a28f-03a13c7d401f', limit: 3 }
      },
      result: {
        data: {
          projectComments: []
        }
      }
    }
  ];

  const comments = {
    projectComments
  }

  const emptyComments = {
    projectComments: []
  }

  it('renders loader', () => {
    render(
      <Context.Provider value={authState}>
        <BrowserRouter>
          <ProjectActivitySummary
            comments={comments}
            commentsLoading
            commentsRefetch={jest.fn()}
            commentsFetchMore={jest.fn()}
          />
        </BrowserRouter>
      </Context.Provider>
    );

    expect(screen.queryByTestId('loader')).toBeInTheDocument();
  });

  it('renders `no activity` message', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={emptyProjectCommentsMock} addTypename={false}>
          <BrowserRouter>
            <ProjectActivitySummary
              comments={emptyComments}
              commentsLoading={false}
              commentsRefetch={jest.fn}
              commentsFetchMore={jest.fn}
            />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('activity-summary')).toBeInTheDocument();
      expect(screen.getByText('processes.no_activity_summary')).toBeInTheDocument();
    });
  });

  it('renders comments', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={projectCommentsMock} addTypename={false}>
          <BrowserRouter>
            <ProjectActivitySummary
              comments={comments}
              commentsLoading={false}
              commentsRefetch={jest.fn}
              commentsFetchMore={jest.fn}
            />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('activity-summary')).toBeInTheDocument();
      expect(screen.queryAllByTestId('comment-body')).toHaveLength(3);
    });
  });
});
