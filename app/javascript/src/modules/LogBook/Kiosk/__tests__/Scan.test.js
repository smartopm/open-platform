import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import routeData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import Scan from '../components/Scan';

jest.mock('react-qr-reader')

// Note: This test adds 1 err and 1 warning, both are coming from the mocked lib above
// Possible Fix: Updating to newer version which uses hooks, currently still in beta v3.0.0.beta
describe('Scan Page', () => {
  const mockHistory = {
    push: jest.fn()
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });
  it('should check if the scan page renders properly', () => {
    const wrapper = render(
      <MemoryRouter>
        <Context.Provider value={authState}>
          <MockedProvider>
            <Scan /> 
          </MockedProvider>
        </Context.Provider>
      </MemoryRouter>
    );

    expect(wrapper.queryByTestId('back_to_welcome')).toBeInTheDocument();
    expect(wrapper.queryByText('logbook:kiosk.center_your_qr_code')).toBeInTheDocument();
    expect(wrapper.queryByLabelText('scan.torch')).toBeInTheDocument();
    
    fireEvent.click(wrapper.queryByTestId('back_to_welcome'))
    expect(mockHistory.push).toBeCalled()
    expect(mockHistory.push).toBeCalledWith('/logbook/kiosk')
  });
});
