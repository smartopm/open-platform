import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { ProjectsStatsQuery, TaskQuarterySummaryQuery, ReplyCommentStatQuery } from '../graphql/process_queries';
import AdminDashboard from '../Components/AdminDashboard'
import taskMock from '../../__mocks__/taskMock'

describe('Admin processes dashboard', () => {
  const currentYear = new Date().getFullYear();
  const mocks = [
    {
      request: {
        query: ProjectsStatsQuery,
      },
      result: {
        data: {
          projects: [taskMock]
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
              [2019, 4, 100]
            ],
            submitted: [
              [currentYear, 1, 200] ,
              [currentYear, 2, 400],
              [currentYear, 3, 219],
              [currentYear, 4, 20],
              [2020, 1, 100]
            ]
          }
        }
      }
    },
    {
      request: {
        query: ReplyCommentStatQuery
      },
      result: {
        data: {
          replyCommentStats: {
            received: 24,
            resolved: 22,
            sent: 23,
          }
        }
      }
    }
  ];

  it('renders the summary page correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <AdminDashboard />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(screen.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryAllByTestId('speed_dial_icon')[0]).toBeInTheDocument()
      expect(screen.queryAllByTestId('speed_dial_btn')[0]).toBeInTheDocument()
      expect(screen.queryAllByTestId('AddIcon')[0]).toBeInTheDocument()
      expect(screen.queryAllByTestId('VisibilityIcon')[0]).toBeInTheDocument()
      expect(screen.queryAllByTestId('speed_dial_action')[0]).toBeInTheDocument()
      expect(screen.queryByText('processes.processes')).toBeInTheDocument()
      expect(screen.queryByText('processes.drc_process')).toBeInTheDocument()
      expect(screen.queryByText('processes.projects_by_quarter')).toBeInTheDocument()
      expect(screen.queryAllByText('processes.submitted')).toHaveLength(2);
      expect(screen.queryAllByText('processes.completed')).toHaveLength(2);
      expect(screen.queryByText('processes.outstanding')).toBeInTheDocument();
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
      expect(screen.queryByText('processes.lifetime_totals')).toBeInTheDocument();
      expect(screen.queryByText('939')).toBeInTheDocument();
      expect(screen.queryByText('689')).toBeInTheDocument();
      expect(screen.queryByText('250')).toBeInTheDocument();
      expect(screen.queryByTestId('comments_button')).toBeInTheDocument();
    })
  });

  it('renders project stages', async () => {
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
      expect(screen.queryByTestId('project-stages')).toBeInTheDocument();
    });
  });
});
