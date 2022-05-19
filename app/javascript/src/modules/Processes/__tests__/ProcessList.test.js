/* eslint-disable import/prefer-default-export */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import { Context } from '../../../containers/Provider/AuthStateProvider'
import authState from '../../../__mocks__/authstate'
import { ProcessTemplatesQuery } from '../graphql/process_list_queries';
import processMock from '../__mocks__/processMock';
import ProcessList from '../Components/ProcessList';
import { ProcessDeleteMutation } from '../graphql/process_list_mutation';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Process Template Lists', () => {
  const mocks = [
    {
      request: {
        query: ProcessTemplatesQuery,
        variables: {
          offset: 0,
          limit: 50
        }
      },
      result: {
        data: {
          processTemplates: [processMock]
        }
      }
    },
    {
      request: {
        query: ProcessDeleteMutation,
        variables: { id: processMock.id },
      },
      result: { data: { processDeleteMutation: { success: true } } },
    }
  ];

  const emptyResponseMock = [
    {
      request: {
        query: ProcessTemplatesQuery,
        variables: {
          offset: 0,
          limit: 50
        }
      },
      result: {
        data: {
          processTemplates: []
        }
      }
    }
  ];

  const errorMock = [
    {
      request: {
        query: ProcessTemplatesQuery,
        variables: {
          offset: 0,
          limit: 50
        }
      },
      result: {
        data: null,
        errors: [
          new Error('An error occurred')
        ]
      }
    }
  ];

  it('renders loader', () => {
    const adminUser = { userType: 'admin', ...authState }
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProcessList />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    expect(screen.queryByTestId('loader')).toBeInTheDocument();
  });

  it('renders no task process templates message', async () => {
    const adminUser = { userType: 'admin', ...authState }
    render(
      <MockedProvider mocks={emptyResponseMock} addTypename={false}>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProcessList />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('breadcrumbs.processes')).toBeInTheDocument();
      expect(screen.queryByText('breadcrumbs.template_list')).toBeInTheDocument();
      expect(screen.queryByText('templates.no_template_list')).toBeInTheDocument();
      expect(screen.queryByTestId('template-speed-dial')).toBeInTheDocument();
    });
  });

  it('renders process template list items with necessary elements', async () => {
    const adminUser = { userType: 'admin', ...authState }
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProcessList />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryAllByText('templates.template_list')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('common:menu.edit_process_template')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('misc.previous')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('misc.next')[0]).toBeInTheDocument();
    });
  });

  it('renders error message', async () => {
    const adminUser = { userType: 'admin', ...authState }
    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProcessList />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('An error occurred')).toBeInTheDocument();
    });
  });

  it('renders dialog box for deleting processs', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProcessList />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    expect(screen.queryByTestId('loader')).toBeInTheDocument();
    await waitFor(() => {

      const menuList = screen.queryByTestId('menu_list')
      const deleteProcessTemplate = screen.queryByText('common:menu.delete_process_template')
      const proceedButton = screen.queryByTestId('proceed_button')

      expect(menuList).toBeInTheDocument()
      fireEvent.click(menuList)

      expect(deleteProcessTemplate).toBeInTheDocument()
      fireEvent.click(deleteProcessTemplate)

      expect(proceedButton).toBeInTheDocument()
      fireEvent.click(proceedButton)
    });
  })
});
