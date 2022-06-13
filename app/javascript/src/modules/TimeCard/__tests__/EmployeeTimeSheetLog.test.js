import React from 'react';
import { BrowserRouter } from 'react-router-dom/';
import { render } from '@testing-library/react';

import EmployeeLogs from '../Components/EmployeeTimeSheetLog';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('time sheet logs component', () => {
  const userData = {
    userTimeSheetLogs: [
      {
        createdAt: '2020-04-29T08:35:27Z',
        startedAt: '2020-04-29T08:35:27Z',
        userId: '999013ef',
        id: '34r34543',
        endedAt: '2020-04-29T10:35:27Z',
        user: {
          name: 'Joen'
        }
      }
    ]
  };

  const userDataProgress = {
    userTimeSheetLogs: [
      {
        createdAt: '2020-04-29T08:35:27Z',
        startedAt: '2020-04-29T08:35:27Z',
        userId: '999013ef',
        id: '34r34543',
        endedAt: null
      }
    ]
  };

  it('should render with given data', () => {
    const { getByText, getByTestId } = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <EmployeeLogs data={userData} name="Joen" />
        </MockedThemeProvider>
      </BrowserRouter>
    );
    expect(getByText('2 hrs')).toBeInTheDocument();
    expect(getByText('Wednesday')).toBeInTheDocument();
    expect(getByTestId('emp_name')).toHaveTextContent('Joen');
    expect(getByTestId('prog')).toBeInTheDocument('2 hrs');
  });

  it('progress should be in the document', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <EmployeeLogs data={userDataProgress} />
        </MockedThemeProvider>
      </BrowserRouter>
    );
    expect(getByTestId('prog')).toBeInTheDocument();
    expect(getByTestId('prog')).toHaveTextContent('timecard.shift_in_progress');
  });
  it('should have summary in the document', () => {
    const container = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <EmployeeLogs data={userData} />
        </MockedThemeProvider>
      </BrowserRouter>
    );
    expect(container.queryByTestId('summary').textContent).toContain('worked_time_stats');
  });
  it('should have summary in the document when there is shift in progress', () => {
    const container = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <EmployeeLogs data={userDataProgress} />
        </MockedThemeProvider>
      </BrowserRouter>
    );
    expect(container.queryByTestId('summary').textContent).toContain('timecard.worked_time_stats');
  });
});
