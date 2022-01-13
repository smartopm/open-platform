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

  it('renders loader', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <AdminDashboard />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(screen.queryByTestId('loader')).toBeInTheDocument();
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
