import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { ProjectStagesQuery, TaskQuarterySummaryQuery } from '../graphql/process_queries';
import AdminDashboard from '../Components/AdminDashboard'

describe('Admin processes dashboard', () => {
  const currentYear = new Date().getFullYear();
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
    },
    {
      request: {
        query: TaskQuarterySummaryQuery,
      },
      result: {
        data: {
          tasksByQuarter: {
            completed: [
              [currentYear, 1, 160] ,
              [currentYear, 2, 300],
              [currentYear, 3, 119],
              [currentYear, 4, 10],
            ],
            submitted: [
              [currentYear, 1, 200] ,
              [currentYear, 2, 400],
              [currentYear, 3, 219],
              [currentYear, 4, 20],
            ]
          }
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
      expect(screen.queryByText('processes.projects_by_quarter')).toBeInTheDocument()
      expect(screen.queryByText('processes.submitted')).toBeInTheDocument()
      expect(screen.queryByText('processes.completed')).toBeInTheDocument()
      expect(screen.queryByText('Q1')).toBeInTheDocument()
      expect(screen.queryByText('Q2')).toBeInTheDocument()
      expect(screen.queryByText('Q3')).toBeInTheDocument()
      expect(screen.queryByText('Q4')).toBeInTheDocument()
      expect(screen.queryByText('processes.year_to_date')).toBeInTheDocument();
      expect(screen.queryByText('160')).toBeInTheDocument();
      expect(screen.queryByText('300')).toBeInTheDocument();
      expect(screen.queryByText('119')).toBeInTheDocument();
      expect(screen.queryByText('10')).toBeInTheDocument();
      expect(screen.queryByText('589')).toBeInTheDocument();
      expect(screen.queryByText('200')).toBeInTheDocument();
      expect(screen.queryByText('400')).toBeInTheDocument();
      expect(screen.queryByText('219')).toBeInTheDocument();
      expect(screen.queryByText('20')).toBeInTheDocument();
      expect(screen.queryByText('839')).toBeInTheDocument();
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
