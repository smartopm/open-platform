import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { SubTasksQuery, TaskQuery } from '../../graphql/task_queries';
import taskMock from '../../__mocks__/taskMock';
import TaskProcessDetail from '../Components/TaskProcessDetail';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Payment List Item Component', () => {
  const mocks = [
    {
    request: {
      query: TaskQuery,
      variables: { taskId: taskMock.id }
    },
    result: {
      data: {
        task: taskMock
      }
    }
  },
  {
    request: {
      query: SubTasksQuery,
      variables: { taskId:taskMock.id, limit: 1, offset: 0 }
    },
    result: {
      data: {
        taskSubTasks: [{ ...taskMock }]
      }
    }
  }
];
  it('should render the payment item component', () => {
    const container = render(
        <MockedProvider mocks={[]} addTypename={false}>
          <BrowserRouter>
            <TaskProcessDetail />
          </BrowserRouter>
        </MockedProvider>
    );

    expect(container.getByTestId('loader')).toBeInTheDocument();

  });
});
