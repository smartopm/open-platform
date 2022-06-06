import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import AddSubTask from '../Components/AddSubTask';
import authState from '../../../__mocks__/authstate';
import { Context } from '../../../containers/Provider/AuthStateProvider';

describe('Add Subtask', () => {
  it('renders properly Add subtask component', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <AddSubTask
                assignUser={jest.fn()}
                taskId="302df8c3-27bb-4175-adc1-43857e972eb4"
                refetch={jest.fn()}
                users={[]}
              />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('add_sub_task_icon')).toBeInTheDocument();
      fireEvent.click(screen.queryByTestId('add_sub_task_icon'));
      expect(screen.queryAllByText('task.task_modal_create_text')[0]).toBeInTheDocument();
    });
  });
});
