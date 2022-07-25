import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { LogbookStatsQuery } from '../graphql/guestbook_queries';
import LogbookStats from '../Components/LogbookStats';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Logbook Stats', () => {
  // props and data
  const mock = {
    request: {
      query: LogbookStatsQuery
    },
    result: {
      data: {
        communityPeopleStatistics: {
          peoplePresent: 2,
          peopleEntered: 2,
          peopleExited: 0,
        }
      }
    }
  };

  const errorMock = {
    request: {
      query: LogbookStatsQuery
    },
    result: {
      data: {
        communityPeopleStatistics: null
      }
    },
    error: new Error('Something wrong happened')
  };
  const props = {
    tabValue: 2,
    shouldRefetch: false,
    handleFilter: jest.fn(),
    isSmall: false
  };

  it('should render the stat count', async () => {
    const { getAllByTestId, getAllByText, getAllByLabelText, getByTestId } = render(
      <MockedProvider mocks={[mock]} addTypename={false}>
        <MockedThemeProvider>
          <LogbookStats {...props} />
        </MockedThemeProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getAllByTestId('stats_title')[0].textContent).toContain('logbook.total_entries');
      expect(getAllByTestId('stats_title')[1].textContent).toContain('logbook.total_exits');
      expect(getAllByTestId('stats_title')[2].textContent).toContain('logbook.total_in_city');
      expect(getAllByTestId('stats_count')[0].textContent).toContain('0');
      expect(getAllByLabelText('common:misc.timeframe')[0]).toBeInTheDocument();
      expect(getAllByText('logbook.visitor_statistics')[0]).toBeInTheDocument();
      expect(getAllByText('common:misc.show common:misc.none')[0]).toBeInTheDocument();

      fireEvent.click(getByTestId('export_data'));
      fireEvent.click(getAllByTestId('card')[0]);
      fireEvent.click(getAllByTestId('card')[1]);
      fireEvent.click(getAllByTestId('card')[2]);
      expect(getAllByTestId('stats_title')[0].textContent).toContain('logbook.total_entries');
    }, 10);
  });
  it('should render 0 if something went wrong', async () => {
    const { getAllByTestId } = render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <MockedThemeProvider>
          <LogbookStats {...props} />
        </MockedThemeProvider>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(getAllByTestId('stats_title')[0].textContent).toContain('logbook.total_entries');
      expect(getAllByTestId('stats_count')[0].textContent).toContain('0');
    }, 10);
  });
});
