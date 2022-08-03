import React from 'react';
import { BrowserRouter } from 'react-router-dom/';
import { render } from '@testing-library/react';
import CustodianLogs from '../Components/CustodianTimeSheetLog';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('time sheet logs component', () => {
  const data = {
    timeSheetLogs: [
      {
        endedAt: null,
        startedAt: '2020-04-29T08:35:27Z',
        id: '57f9b2c3',
        user: {
          name: 'JMM'
        },
        userId: '999013ef'
      }
    ]
  };

  const wrapper = render(
    <BrowserRouter>
      <MockedThemeProvider>
        <CustodianLogs data={data} />
      </MockedThemeProvider>
    </BrowserRouter>
  );
  it('should render data with given props', () => {
    expect(wrapper.queryByText('JMM')).toBeInTheDocument();
    expect(wrapper.queryByText(/In-Progress/)).toBeInTheDocument();
  });
});
