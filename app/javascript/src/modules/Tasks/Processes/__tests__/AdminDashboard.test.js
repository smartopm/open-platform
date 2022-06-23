import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

import { render, screen, waitFor } from '@testing-library/react';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { ProcessTemplatesQuery } from '../../../Processes/graphql/process_list_queries';
import AdminDashboard from '../Components/AdminDashboard';

describe('Admin processes dashboard', () => {
  const mocks = [
    {
      request: {
        query: ProcessTemplatesQuery,
      },
      result: {
        data: {
          processTemplates: [
            {
              id: 'c5da1e74-ab0e-4010-903e-e6b28a3081ce',
              name: 'DRC Process',
              form: {
                id: 'f5365912-5c3f-4449-8664-44c8f6fc8204'
              },
              noteList: {
                id: '77a77fd8-ca07-4fcf-ae1e-b9d855e7ffe9'
              }
            },
            {
              id: '59471df3-5e56-48a8-a2fe-d9f7df6f48e7',
              name: 'Permit Application Process',
              form: {
                id: '31c8a69e-4d16-4d8a-bb3c-8ba3070ef5bc'
              },
              noteList: {
                id: 'f3c609d4-a6bf-4e58-8b3c-def17d3240bc'
              }
            }
          ]
        }
      }
    }
  ];

  it('renders main dashboard elements', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <AdminDashboard />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(screen.queryAllByTestId('speed_dial_icon')[0]).toBeInTheDocument();
    expect(screen.queryAllByTestId('speed_dial_btn')[0]).toBeInTheDocument();
    expect(screen.queryAllByTestId('AddIcon')[0]).toBeInTheDocument();
    expect(screen.queryAllByTestId('VisibilityIcon')[0]).toBeInTheDocument();
    expect(screen.queryAllByTestId('speed_dial_action')[0]).toBeInTheDocument();
  });

  it('renders Process list items', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <AdminDashboard />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('DRC Process')).toBeInTheDocument();
      expect(screen.queryByText('Permit Application Process')).toBeInTheDocument();
    })
  });
});
