import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import routeData, { MemoryRouter } from 'react-router';
import Welcome from '../components/Welcome';
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
          <Welcome /> 
        </Context.Provider>
      </MemoryRouter>
    );

    expect(wrapper.queryByTestId('community_logo')).toBeInTheDocument();
    expect(wrapper.queryByAltText('community logo')).toBeInTheDocument();
    expect(wrapper.queryByTestId('start_scan_btn')).toBeInTheDocument();
    expect(wrapper.queryByTestId('no_qr_code_text')).toBeInTheDocument();
    
    fireEvent.click(wrapper.queryByTestId('start_scan_btn'))
    expect(mockHistory.push).toBeCalled()
    expect(mockHistory.push).toBeCalledWith('/logbook/kiosk/scan')
  });
});
