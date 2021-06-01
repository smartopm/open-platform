import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import RequestStatus from '../Components/RequestStatus';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('RequestStatus Component', () => {
  it('should render the given props correctly', () => {
    const props = {
      isDenied: true
    };
    const wrapper = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <RequestStatus {...props} />
        </MockedThemeProvider>
      </BrowserRouter>
    );
    expect(wrapper.queryByTestId('status').textContent).toContain('Denied');
    expect(wrapper.queryByTestId('action').textContent).toContain('Call Manager');
    expect(wrapper.queryByText('Ok')).toBeInTheDocument()
  });
});