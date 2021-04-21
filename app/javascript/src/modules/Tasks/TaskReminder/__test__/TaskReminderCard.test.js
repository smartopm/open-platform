import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import TaskReminderCard from '../Components/TaskReminderCard';
import { AssignedTaskQuery } from '../graphql/task_reminder_query';
import { Spinner } from '../../../../shared/Loading';

describe('Task Reminder Component', () => {
  const mock = [{
    request: {
      query: AssignedTaskQuery,
      variables: { id: 't8y2euj2uihr23r' }
    },
    result: {
      data: {
        userTasks: [
          {
            id: 'jh983hf3',
            body: 'body',
            dueDate: '2021-03-01T09:55:05Z'
          }
        ]
      }
    }
  }]

  it('should render the TaskReminderCard', async () => {
    const container = render(
      <MockedProvider mocks={mock} addTypename={false}>
        <BrowserRouter>
          <TaskReminderCard
            id='t8y2euj2uihr23r'
          />
        </BrowserRouter>
      </MockedProvider>
    );
    
    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryAllByTestId('body')[0]).toBeInTheDocument();
      },
      { timeout: 200 }
    );

    fireEvent.click(container.queryAllByTestId('body')[0])
  });
});
