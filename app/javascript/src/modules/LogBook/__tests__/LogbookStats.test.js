import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { LogbookStatsQuery } from '../graphql/guestbook_queries';
import LogbookStats from '../Components/LogbookStats';

describe('Logbook Stats', () => {
  // props and data
  const mock = {
    request: {
      query: LogbookStatsQuery
    },
    result: {
      data: {
        communityPeopleStatistics: {
          peoplePresent: 2
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
    shouldRefetch: false
  };

  it('should render the stat count', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[mock]} addTypename={false}>
        <LogbookStats {...props} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByTestId('stats_title').textContent).toContain('logbook.total_in_city');
      expect(getByTestId('stats_count').textContent).toContain('2');
    }, 10);
  });
  it('should render 0 if something went wrong', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <LogbookStats {...props} />
      </MockedProvider>
    );
    await waitFor(() => {
        expect(getByTestId('stats_title').textContent).toContain('logbook.total_in_city');
      expect(getByTestId('stats_count').textContent).toContain('0');
    }, 10);
  });
});
