/* eslint-disable import/prefer-default-export */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import { CreateTaskList } from '../graphql/task_list_mutation';
import taskMock from '../../__mocks__/taskMock';
import authState from '../../../../__mocks__/authstate';
import TaskListConfigure from '../Components/TaskListConfigure';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Task List Create', () => {
  const TaskListConfigureMock = [
    {
      request: {
        query: CreateTaskList,
        variables: {
          body: 'Sample task list'
        }
      },
      result: {
        data: {
          TaskListConfigure: {
            note: taskMock
          }
        }
      }
    }
  ];

  it('renders TaskListConfigure component', async () => {
    const adminUser = { userType: 'admin', ...authState };
    render(
      <MockedProvider mocks={TaskListConfigureMock} addTypename={false}>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <MockedThemeProvider>
              <TaskListConfigure />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );
    expect(screen.getByTestId('task-list-name')).toBeInTheDocument();

    const nameField = screen.getByLabelText('task_lists.task_list_name');
    userEvent.type(nameField, 'Sample task list');

    const saveButton = screen.getByRole('button');

    expect(saveButton).toBeEnabled();
    await waitFor(() => fireEvent.click(saveButton));
  });
});
