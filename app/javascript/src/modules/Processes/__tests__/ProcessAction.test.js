import React from 'react';
import routeData, { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import { Context } from '../../../containers/Provider/AuthStateProvider'
import authState from '../../../__mocks__/authstate'
import { ProcessFormsQuery, ProcessTaskListsQuery } from '../graphql/process_list_queries';
import ProcessAction from '../Components/ProcessAction';
import MockedSnackbarProvider, { mockedSnackbarProviderProps } from '../../__mocks__/mock_snackbar';
import { SnackbarContext } from '../../../shared/snackbar/Context';

const processMock = {
  id: "c5da1e74-ab0e-4010-903e-e6b28a3081ce",
  name: "DRC Process",
  form: {
    id: "f5365912-5c3f-4449-8664-44c8f6fc8204"
  },
  noteList: {
    id: "77a77fd8-ca07-4fcf-ae1e-b9d855e7ffe9"
  }
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn()
  })
}));

const mocks = [
  {
    request: {
      query: ProcessFormsQuery,
    },
    result: {
      data: {
        forms: [{ id: processMock.form.id, name: 'Form 1' }]
      },
      loading: false,
    }
  },

  {
    request: {
      query: ProcessTaskListsQuery,
    },
    result: {
      data: {
        processTaskLists: [{ id: processMock.noteList.id, name: 'TaskList 1'}]
      },
      loading: false,
    }
  }
];

describe('Create Process Form', () => {
  it('renders form to create a process with necessary elements', async () => {
    const adminUser = { userType: 'admin', ...authState }
    render(
      <Context.Provider value={adminUser}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <ProcessAction />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      // Breadcrumbs
      expect(screen.queryByText('breadcrumbs.processes')).toBeInTheDocument();
      expect(screen.queryAllByText('breadcrumbs.create_process')[0]).toBeInTheDocument();
      expect(screen.queryByText('templates.create_process')).toBeInTheDocument();

      // Form Inputs
      expect(screen.queryAllByText('templates.new_process_name_label')[0]).toBeInTheDocument();
      expect(screen.queryByTestId('process-name')).toBeInTheDocument();
      expect(screen.queryByTestId('process-name-input')).toBeInTheDocument();
      expect(screen.queryAllByText('templates.process_name_helper_text')[0]).toBeInTheDocument();

      expect(screen.queryAllByText('templates.process_form_label')[0]).toBeInTheDocument();
      expect(screen.queryByTestId('process-form-dropdown')).toBeInTheDocument();
      expect(screen.queryAllByText('templates.process_form_helper_text')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('templates.process_form_helper_text_link_text')[0]).toBeInTheDocument();

      expect(screen.queryAllByText('templates.process_task_list_label')[0]).toBeInTheDocument();
      expect(screen.queryByTestId('process-note-list-dropdown')).toBeInTheDocument();
      expect(screen.queryAllByText('templates.process_task_list_helper_text')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('templates.process_task_list_helper_text_link_text')[0]).toBeInTheDocument();

      expect(screen.queryByTestId('process-submit-btn')).toBeInTheDocument();
      expect(screen.queryAllByText('templates.save_process')[0]).toBeInTheDocument();
    });
  });
});

describe('Edit Process Form', () => {
  beforeEach(() => {
    const mockLocation = {
      pathname: '/processes/templates/edit',
      state: { process: processMock }
    }
    jest.spyOn(routeData, 'useLocation').mockReturnValue(mockLocation);
  });

  it('renders form to edit a process with necessary elements', async () => {
    const adminUser = { userType: 'admin', ...authState }
    render(
      <Context.Provider value={adminUser}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <ProcessAction />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      // Breadcrumbs
      expect(screen.queryByText('breadcrumbs.processes')).toBeInTheDocument();
      expect(screen.queryAllByText('breadcrumbs.edit_process')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('templates.edit_process')[0]).toBeInTheDocument();

      // Form Inputs
      expect(screen.queryAllByText('templates.edit_process_name_label')[0]).toBeInTheDocument();
      expect(screen.queryByTestId('process-name')).toBeInTheDocument();
      expect(screen.queryByTestId('process-name-input')).toBeInTheDocument();
      expect(screen.queryAllByText('templates.process_name_helper_text')[0]).toBeInTheDocument();

      expect(screen.queryAllByText('templates.process_form_label')[0]).toBeInTheDocument();
      expect(screen.queryByTestId('process-form-dropdown')).toBeInTheDocument();
      expect(screen.queryAllByText('templates.process_form_helper_text')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('templates.process_form_helper_text_link_text')[0]).toBeInTheDocument();

      expect(screen.queryAllByText('templates.process_task_list_label')[0]).toBeInTheDocument();
      expect(screen.queryByTestId('process-note-list-dropdown')).toBeInTheDocument();
      expect(screen.queryAllByText('templates.process_task_list_helper_text')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('templates.process_task_list_helper_text_link_text')[0]).toBeInTheDocument();

      expect(screen.queryByTestId('process-submit-btn')).toBeInTheDocument();
      expect(screen.queryAllByText('templates.edit_process')[0]).toBeInTheDocument();
    });
  });

  it('updates process', async () => {
    const adminUser = { userType: 'admin', ...authState }
    render(
      <Context.Provider value={adminUser}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <SnackbarContext.Provider value={{...mockedSnackbarProviderProps}}>
                <ProcessAction />
              </SnackbarContext.Provider>
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    const processNameField = screen.queryByTestId('process-name-input');
    fireEvent.change(processNameField, { target: { value: 'New process name' } });
    expect(processNameField.value).toBe('New process name');
    const submitBtn = screen.getByTestId('process-submit-btn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockedSnackbarProviderProps.showSnackbar).toHaveBeenCalled();
    });
  });
});
