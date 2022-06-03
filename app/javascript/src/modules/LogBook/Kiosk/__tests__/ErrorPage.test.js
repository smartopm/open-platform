import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import routeData, { MemoryRouter } from 'react-router';
import ErrorPage from '../components/ErrorPage';

describe('Error Page', () => {
  const mockHistory = {
    push: jest.fn()
  };

  const mockParams = {
    pathname: '/error',
    search: '?status=timeout'
  };

  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
    jest.spyOn(routeData, 'useLocation').mockReturnValue(mockParams);
  });
  it('should check if the  error page renders properly', () => {
    const wrapper = render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );

    expect(wrapper.queryByTestId('error_title')).toBeInTheDocument();
    expect(wrapper.queryByTestId('error_title').textContent).toContain('common:misc.error');
    expect(wrapper.queryByTestId('error_message')).toBeInTheDocument();
    expect(wrapper.queryByTestId('error_message').textContent).toContain('kiosk.qr_not_detected');
    expect(wrapper.queryByTestId('try_again_message')).toBeInTheDocument();

    fireEvent.click(wrapper.queryByTestId('try_again_message'));
    expect(mockHistory.push).toBeCalled();
    expect(mockHistory.push).toBeCalledWith('/logbook/kiosk/scan');
  });
});

describe('Error Page when access is denied', () => {
  const mockParams = {
    pathname: '/error',
    search: '?status=error'
  };

  beforeEach(() => {
    jest.spyOn(routeData, 'useLocation').mockReturnValue(mockParams);
  });
  it('should check if the  error page renders properly', () => {
    const wrapper = render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );
    expect(wrapper.queryByTestId('error_title')).toBeInTheDocument();
    expect(wrapper.queryByTestId('error_title').textContent).toContain('kiosk.access_denied');
    expect(wrapper.queryByTestId('error_message')).toBeInTheDocument();
    expect(wrapper.queryByTestId('error_message').textContent).toContain('kiosk.speak_to_guard_on_duty');
    expect(wrapper.queryByTestId('try_again_message')).toBeInTheDocument();
  });
});
