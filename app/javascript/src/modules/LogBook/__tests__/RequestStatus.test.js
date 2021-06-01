import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import RequestStatus from '../Components/RequestStatus';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/userMock';

describe('RequestStatus Component', () => {
  it('should render the given props correctly', () => {
    const props = {
      isDenied: true
    };
    const wrapper = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <Context.Provider value={userMock}>
            <RequestStatus {...props} />
          </Context.Provider>
        </MockedThemeProvider>
      </BrowserRouter>
    );
    expect(wrapper.queryByTestId('status').textContent).toContain('Denied');
    expect(wrapper.queryByTestId('action').textContent).toContain('Call Manager');
    expect(wrapper.queryByText('Ok')).toBeInTheDocument()
  });
});
