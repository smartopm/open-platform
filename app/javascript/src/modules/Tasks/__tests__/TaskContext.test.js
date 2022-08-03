import React from 'react';
import { render, waitFor } from '@testing-library/react';

import routeData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import TaskContextProvider from '../Context';
import { UpdateNote } from '../graphql/task_mutation';

describe('Task Context', () => {
  const mockParams = {
    id: '/123'
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useParams').mockReturnValue(mockParams);
  });
  it('should have context', async () => {
    const mocks = [
      {
        request: {
          query: UpdateNote,
          variables: { id: '123', completed: true }
        },
        result: {
          data: {
            note: { flagged: true, body: '', id: '123', dueDate: '', parentNote: { id: '456' } }
          }
        }
      }
    ];

    const wrapper = render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <TaskContextProvider>
            <p>Some child component</p>
          </TaskContextProvider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(wrapper.queryByText('Some child component')).toBeInTheDocument();
    }, 10);
  });
});
