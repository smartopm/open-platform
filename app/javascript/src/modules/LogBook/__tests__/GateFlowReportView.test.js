import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { MockedProvider } from '@apollo/react-testing';
import GateFlowReport from '../Components/GateFlowReport';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import { logbookEventLogsQuery } from '../graphql/guestbook_queries';
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar';

describe('GateFlowReport', () => {
  it('should properly render the logs report view', async () => {
    const eventsMock = {
      request: {
        query: logbookEventLogsQuery,
        variables: { startDate: null, endDate: null }
      },
      result: {
        data: {
          logbookEventLogs: []
        }
      }
    };
    const wrapper = render(
      <MockedProvider mocks={[eventsMock]}>
        <MockedThemeProvider>
          <MockedSnackbarProvider>
            <GateFlowReport />
          </MockedSnackbarProvider>
        </MockedThemeProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(wrapper.queryByText('misc.export_data')).toBeInTheDocument();
      expect(wrapper.queryByText('misc.export_data')).toBeDisabled();
      expect(wrapper.queryByText('guest_book.gate_flow_report')).toBeInTheDocument();
      expect(wrapper.queryAllByText('guest_book.start_date')[0]).toBeInTheDocument();
      expect(wrapper.queryAllByText('guest_book.end_date')[0]).toBeInTheDocument();
      expect(wrapper.queryAllByLabelText('Choose date')).toHaveLength(2);
    }, 10);
  });
});
