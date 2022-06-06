import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import routeData, { MemoryRouter } from 'react-router';
import AccessPage from '../components/AccessPage';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';

describe('Access Page', () => {
  const mockHistory = {
    push: jest.fn()
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });
  it('should check if the page renders properly', () => {
    const wrapper = render(
      <MemoryRouter>
        <Context.Provider value={authState}>
          <AccessPage />
        </Context.Provider>
      </MemoryRouter>
    );

    expect(wrapper.queryByTestId('access_granted')).toBeInTheDocument();
    expect(wrapper.queryByTestId('welcome_to_community')).toBeInTheDocument();
    expect(wrapper.queryByTestId('new_scan_btn')).toBeInTheDocument();
    
    fireEvent.click(wrapper.queryByTestId('new_scan_btn'))
    expect(mockHistory.push).toBeCalled()
    expect(mockHistory.push).toBeCalledWith('/logbook/kiosk/scan')
  });
});
