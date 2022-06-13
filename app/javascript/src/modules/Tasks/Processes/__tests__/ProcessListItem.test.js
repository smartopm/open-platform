import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

import { render, screen, waitFor } from '@testing-library/react';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import {
  ProjectStagesQuery,
  ProjectsStatsQuery,
  ReplyCommentStatQuery,
  TaskQuarterySummaryQuery,
} from '../graphql/process_queries';
import ProcessListItem from '../Components/ProcessListItem'
import taskMock from '../../__mocks__/taskMock'

describe('ProcessListItem', () => {
  const currentYear = new Date().getFullYear();
  const mockProcessItem = {
    id: 'c5da1e74-ab0e-4010-903e-e6b28a3081ce',
    name: 'DRC Process',
  };

  const mocks = [
    {
      request: {
        query: TaskQuarterySummaryQuery,
        variables: { processId: 'c5da1e74-ab0e-4010-903e-e6b28a3081ce' },
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
        query: ReplyCommentStatQuery,
        variables: { processId: 'c5da1e74-ab0e-4010-903e-e6b28a3081ce' },
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
    },
    {
      request: {
        query: ProjectStagesQuery,
        variables: { processId: 'c5da1e74-ab0e-4010-903e-e6b28a3081ce' },
      },
      result: {
        data: {
          projectStages: [
            {
              id: "8bf66897-4ee1-4e79-94b3-5f6280601af1",
              body: "Concept Design Review"
            },
            {
              id: "05ce85a4-07ea-4432-b388-c5b3c22851f1",
              body: "Scheme Design Review"
            },
          ]
        }
      }
    },
    {
      request: {
        query: ProjectsStatsQuery,
        variables: { processId: 'c5da1e74-ab0e-4010-903e-e6b28a3081ce' },
      },
      result: {
        data: {
          projects: [taskMock]
        }
      }
    },
  ];

  it('renders the summary page correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <ProcessListItem processItem={mockProcessItem} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(screen.queryAllByTestId('skeleton')[0]).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('DRC Process')).toBeInTheDocument();
      expect(screen.queryAllByText('processes.submitted')).toHaveLength(2);
      expect(screen.queryAllByText('processes.completed')).toHaveLength(2);
      expect(screen.queryByText('processes.outstanding')).toBeInTheDocument();
      expect(screen.queryByText('Q1')).toBeInTheDocument();
      expect(screen.queryByText('Q2')).toBeInTheDocument();
      expect(screen.queryByText('Q3')).toBeInTheDocument();
      expect(screen.queryByText('Q4')).toBeInTheDocument();
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
            <ProcessListItem processItem={mockProcessItem} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('project-stages')).toBeInTheDocument();
      expect(screen.queryByText('Concept Design Review')).toBeInTheDocument();
      expect(screen.queryByText('Scheme Design Review')).toBeInTheDocument();
    });
  });
});
