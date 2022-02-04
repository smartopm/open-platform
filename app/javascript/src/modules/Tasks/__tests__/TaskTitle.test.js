import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';
import { UserFormPropertiesQuery } from '../../Forms/graphql/forms_queries';
import taskMock from '../__mocks__/taskMock'
import TaskTitle from '../Components/TaskTitle';

describe('Task title', () => {
  const UserFormPropertiesMock = [
    {
      request: {
        query: UserFormPropertiesQuery,
        variables: {
          formUserId: taskMock.formUserId,
          userId: authState.user.id
        }
      },
      result: {
        data: {
          formUserProperties:[
            {
              formProperty: {
                fieldName: 'Project Developer',
                fieldType: 'text',
                fieldValue: null,
                id: '3145c47e-1279-47b0-9dac-dc4a7e30562e',
                groupingId: '3145c47e-1279-47b0-9dac',
                adminUse: false,
                order: '1'
              },
              fileName: 'Project X File',
              value: 'Development Co.',
              imageUrl: 'https://image.com',
              fileType: null,
              createdAt: "2020-10-07T09:37:03Z",
              user: {
                name: 'John Doe'
              }
            },
          ]
        }
      }
    }
  ];

  it('renders without error', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={UserFormPropertiesMock} addTypename={false}>
          <BrowserRouter>
            <TaskTitle task={taskMock} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('task-title')).toBeInTheDocument();
    }, 10)
  });
});
