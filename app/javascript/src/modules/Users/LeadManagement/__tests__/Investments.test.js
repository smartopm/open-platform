/* eslint-disable max-lines */
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MockedProvider } from '@apollo/react-testing';
import authState from '../../../../__mocks__/authstate';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import Investments from '../Components/Investments';
import { DealDetailsQuery, LeadInvestmentsQuery, InvestmentStatsQuery } from '../graphql/queries';
import CreateEvent from '../graphql/mutations';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import MockedSnackbarProvider from '../../../__mocks__/mock_snackbar';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('LeadEvents Page', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const queriesMock = [
    {
      request: {
        query: DealDetailsQuery,
        variables: { userId: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99', logType: 'deal_details' },
      },
      result: {
        data: {
          leadLogs: [
            {
              id: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e9990099',
              name: 'Tilisi run 2022',
              dealSize: '$40000000',
              investmentTarget: '$20000',
              createdAt: new Date(),
              actingUser: {
                name: 'Daniel Mutuba',
              },
            },
          ],
        },
      },
    },
    {
      request: {
        query: LeadInvestmentsQuery,
        variables: { userId: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99', logType: 'investment' },
      },
      result: {
        data: {
          leadLogs: [
            {
              id: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e9990099',
              name: 'Tilisi run 2022',
              amount: '$4000',
              createdAt: new Date(),
              actingUser: {
                name: 'Daniel Mutuba',
              },
            },
          ],
        },
      },
    },
    {
      request: {
        query: InvestmentStatsQuery,
        variables: { userId: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99' },
      },
      result: {
        data: {
          investmentStats: [
            {
              percentage_of_target_used: '0.000454',
              total_spent: '$1500',
            },
          ],
        },
      },
    },
  ];

  const eventRequestDataMock = [
    ...queriesMock,
    {
      request: {
        query: CreateEvent,
        variables: {
          userId: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99',
          dealSize: 45000000,
          investmentTarget: 105000,
          logType: 'deal_details',
        },
      },
      result: {
        data: {
          leadLogCreate: {
            success: true,
          },
        },
      },
    },
    {
      request: {
        query: CreateEvent,
        variables: {
          userId: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99',
          name: 'Flight to Paris',
          amount: 85000,
          logType: 'investment',
        },
      },
      result: {
        data: {
          leadLogCreate: {
            success: true,
          },
        },
      },
    },
  ];

  it('Creates an investment entry', async () => {
    render(
      <MockedProvider mocks={eventRequestDataMock} addTypename={false}>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <Investments userId="c96f64bb-e3b4-42ff-b6a9-66889ec79e99" handleEditClick={() => {}} />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('investment')[0]).toBeInTheDocument();
      expect(screen.queryByTestId('investment_header')).toBeInTheDocument();
      expect(screen.queryByText('lead_management.investment')).toBeInTheDocument();
      const dealSizeTextField = screen.getByLabelText('lead_management.deal_size');

      ReactTestUtils.Simulate.change(dealSizeTextField, {
        target: { value: '45000000' },
      });

      const investmentTargetTextField = screen.getByLabelText('lead_management.investment_target');

      ReactTestUtils.Simulate.change(investmentTargetTextField, {
        target: { value: '25000' },
      });

      const saveButton = screen.queryByTestId('add-investment-button');
      // // user input should set add button enabled
      expect(saveButton).toBeEnabled();
    });
    // clicking on the add button should submit current data
    await waitFor(() => {
      fireEvent.click(screen.queryByTestId('add-investment-button'));
    });
  });

  it('Creates an investment expense', async () => {
    render(
      <MockedProvider mocks={eventRequestDataMock} addTypename={false}>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <Investments userId="c96f64bb-e3b4-42ff-b6a9-66889ec79e99" handleEditClick={() => {}} />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      const descriptionTextField = screen.getByLabelText('lead_management.description');

      ReactTestUtils.Simulate.change(descriptionTextField, {
        target: { value: 'Flight to Paris' },
      });

      const investmentTargetTextField = screen.getByLabelText('lead_management.amount');

      ReactTestUtils.Simulate.change(investmentTargetTextField, {
        target: { value: '85000' },
      });

      const saveButton = screen.queryByTestId('add-investment-size-button');
      // // user input should set add button enabled
      expect(saveButton).toBeEnabled();
    });
    // clicking on the add button should submit current data
    await waitFor(() => {
      fireEvent.click(screen.queryByTestId('add-investment-size-button'));
    });
  });
});
