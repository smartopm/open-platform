/* eslint-disable import/prefer-default-export */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import { Context } from '../../../containers/Provider/AuthStateProvider'
import authState from '../../../__mocks__/authstate'
import { ProcessFormsQuery, ProcessTaskListsQuery } from '../graphql/process_list_queries';
import ProcessCreate from '../Components/ProcessCreate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Create Process Form', () => {
  const mocks = [
    {
      request: {
        query: ProcessFormsQuery,
      },
      result: {
        data: {
          forms: [{ id: '123', name: 'Form 1' }]
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
          processTaskLists: [{ id: '456', name: 'TaskList 1'}]
        },
        loading: false,
      }
    }
  ];


  it('renders form to create a process with necessary elements', async () => {
    const adminUser = { userType: 'admin', ...authState }
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProcessCreate />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      // Breadcrumbs
      expect(screen.queryByText('breadcrumbs.processes')).toBeInTheDocument();
      expect(screen.queryByText('breadcrumbs.create_process')).toBeInTheDocument();
      expect(screen.queryByText('templates.create_process')).toBeInTheDocument();
      
      // Form Inputs
      expect(screen.queryAllByText('templates.process_name_label')[0]).toBeInTheDocument();
      expect(screen.queryByTestId('new-process-name')).toBeInTheDocument();
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
