import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MockedProvider } from '@apollo/react-testing';
import ScoreCard from '../Components/ScoreCard';
import MockedThemeProvider from '../../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Score Card', () => {
  const data = {
    score: [
      { col1: 'Q1', col2: 1, col3: 2, col4: 3 },
      { col1: 'Q2', col2: 1, col3: 2, col4: 3 },
      { col1: 'Q3', col2: 1, col3: 2, col4: 3 },
      { col1: 'Q4', col2: 1, col3: 2, col4: 3 }
    ]
  };
  it('ScoreCard component', async () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <ScoreCard data={data} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('col1')[0]).toHaveTextContent('Q1');
      expect(screen.queryAllByTestId('col2')[0]).toHaveTextContent(1);
      expect(screen.queryAllByTestId('col3')[0]).toHaveTextContent(2);
      expect(screen.queryAllByTestId('col4')[0]).toHaveTextContent(3);
    }, 10);
  });

  it('status ScoreCard component', async () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <ScoreCard data={data} statusCard />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('stat1')[0]).toHaveTextContent('Jan');
      expect(screen.queryAllByTestId('stat2')[0]).toHaveTextContent('Feb');
      expect(screen.queryAllByTestId('stat3')[0]).toHaveTextContent('Mar');
    }, 10);
  });

  it('current status ScoreCard component', async () => {
    const newData = {
      score: [
        { col1: 'Interest Shown', col2: 3 },
        { col1: 'Investment Motive Verified', col2: 5 }
      ]
    };
    render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <ScoreCard data={newData} currentStatus />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('col1')[0]).toHaveTextContent('Interest Shown');
      expect(screen.queryAllByTestId('col2')[0]).toHaveTextContent(3);
    }, 10);
  });
});
