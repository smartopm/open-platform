/* eslint-disable max-lines */
import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MockedProvider } from '@apollo/react-testing';
import authState from '../../../../__mocks__/authstate';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import Investments from '../Components/Investments';
import { DealDetailsQuery, LeadInvestmentsQuery, InvestmentStatsQuery } from '../graphql/queries';
import CreateEvent from '../graphql/mutations';
import MockedThemeProvider from '../../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('LeadEvents Page', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const DealDetailsDataMock = [
    {
      request: {
        query: DealDetailsQuery,
        variables: { userId: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99' }
      },
      result: {
        data: {
          dealDetails: [
            {
              id: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e9990099',
              name: 'Tilisi run 2022',
              dealSize: '$40000000',
              investmentTarget: '$20000',
              createdAt: new Date(),
              actingUser: {
                name: 'Daniel Mutuba'
              }
            }
          ]
        }
      }
    }
  ];

  const LeadInvestmentsDataMock = [
    {
      request: {
        query: LeadInvestmentsQuery,
        variables: { userId: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99' }
      },
      result: {
        data: {
          leadInvestments: [
            {
              id: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e9990099',
              name: 'Tilisi run 2022',
              amount: '$4000',
              createdAt: new Date(),
              actingUser: {
                name: 'Daniel Mutuba'
              }
            }
          ]
        }
      }
    }
  ];
  const InvestmentStatsDataMock = [
    {
      request: {
        query: InvestmentStatsQuery,
        variables: { userId: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99' }
      },
      result: {
        data: {
          investmentStats: [
            {
              percentage_of_target_used: '0.000454',
              total_spent: '$1500'
            }
          ]
        }
      }
    }
  ];

  const eventRequestDataMock = [
    {
      request: {
        query: CreateEvent,
        variables: {
          userId: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99',
          dealSize: parseFloat(45000000),
          investmentTarget: parseFloat(25000),
          logType: 'deal_details'
        }
      },
      result: {
        data: {
          leadLogCreate: {
            success: true
          }
        }
      }
    }
  ];

  it('Creates an investment entry', async () => {
    render(
      <MockedProvider mocks={eventRequestDataMock} addTypename={false}>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <Investments
                dealDetailsData={DealDetailsDataMock[0].result.data}
                leadInvestmentData={LeadInvestmentsDataMock[0].result.data}
                investmentStatsData={InvestmentStatsDataMock[0].result.data}
                handleSubmit={jest.fn()}
              />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('investment')[0]).toBeInTheDocument();
      expect(screen.queryByTestId('investment_header')).toBeInTheDocument();
      expect(screen.queryByText('lead_management.investment')).toBeInTheDocument();
    });
  });
});
