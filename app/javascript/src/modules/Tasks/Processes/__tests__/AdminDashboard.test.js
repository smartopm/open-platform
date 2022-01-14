import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { ProjectStagesQuery } from '../graphql/process_queries';
import AdminDashboard from '../Components/AdminDashboard'

describe('Admin processes dashboard', () => {
  const mocks = [
    {
      request: {
        query: ProjectStagesQuery,
      },
      result: {
        data: {
          projectStages: [
            [
              "Concept Design Review",
              2
            ] ,
            [
              "Scheme Design Review",
              1
            ]
          ]
        }
      }
    }
  ];

  it('renders the summary page correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <AdminDashboard />
        </BrowserRouter>
      </MockedProvider>
    );
    expect(screen.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('processes.processes')).toBeInTheDocument()
      expect(screen.queryByText('processes.drc_process')).toBeInTheDocument()
      expect(screen.queryByText('processes.completed_by_quarter')).toBeInTheDocument()
      expect(screen.queryAllByText('Total completed')[0]).toBeInTheDocument()
      expect(screen.queryAllByText('Total completed')).toHaveLength(4)
      expect(screen.queryByText('Q1 completed')).toBeInTheDocument()
      expect(screen.queryByText('Q2 completed')).toBeInTheDocument()
      expect(screen.queryByText('Q3 completed')).toBeInTheDocument()
      expect(screen.queryByText('Q4 completed')).toBeInTheDocument()
    })
  });

  it('renders project stages', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <AdminDashboard />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('project-stages')).toBeInTheDocument();
    });
  });
});
