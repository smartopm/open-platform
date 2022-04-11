import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import routeData, { MemoryRouter } from 'react-router';
import ErrorPage from '../components/ErrorPage';

describe('Error Page', () => {
  const mockHistory = {
    push: jest.fn()
  };

  const mockParams = {
    pathname: '/error',
    search: '?status=timeout',
  };

  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
    jest.spyOn(routeData, 'useLocation').mockReturnValue(mockParams);
  });
//   TODO: Test when error is timeout or access denied
  it('should check if the  error page renders properly', () => {
    const wrapper = render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );

    expect(wrapper.queryByTestId('error_title')).toBeInTheDocument();
    expect(wrapper.queryByTestId('error_message')).toBeInTheDocument();
    expect(wrapper.queryByTestId('try_again_message')).toBeInTheDocument();
    
    fireEvent.click(wrapper.queryByTestId('try_again_message'))
    expect(mockHistory.push).toBeCalled()
    expect(mockHistory.push).toBeCalledWith('/logbook/kiosk/scan')
  });
});
