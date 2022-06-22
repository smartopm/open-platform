import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MockedProvider } from '@apollo/react-testing';
import authState from '../../../../__mocks__/authstate';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import LeadsPage from '../Components/LeadsPage';
import { LeadScoreCardQuery } from '../graphql/queries';
import MockedThemeProvider from '../../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Leads Page', () => {
  const dataMock = [
    {
      request: {
        query: LeadScoreCardQuery
      },
      result: {
        data: {
          leadScorecards: {
            lead_status: {
              Evaluation: 2,
              'Qualified Lead': 5
            },
            leads_monthly_stats_by_division: {
              China: {
                5: 2,
                1: 5
              },
              Europe: {
                2: 6,
                7: 8
              },
              India: {
                3: 7,
                8: 4
              }
            },
            leads_monthly_stats_by_status: {
              'Qualified Lead': {
                5: 1
              },
              "Signed Lease": {
                5: 1
              },
              "Signed MOU": {
                5: 1
              }
            },
            ytd_count: {
              leads_by_division: 4,
              qualified_lead: 3,
              signed_lease: 5,
              signed_mou: 5
            }
          }
        }
      }
    }
  ];

  it('LeadsPage component', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={dataMock} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <LeadsPage />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('subtitle')).toBeInTheDocument();
      expect(screen.queryByTestId('monthly_lead')).toBeInTheDocument();
      expect(screen.queryByTestId('card_one')).toBeInTheDocument();
      expect(screen.queryByTestId('card_two')).toBeInTheDocument();
      expect(screen.queryByTestId('monthly_lead')).toBeInTheDocument();
    }, 10);
  });
});
