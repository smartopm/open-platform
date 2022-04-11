import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import routeData, { MemoryRouter } from 'react-router';
import AccessPage from '../components/AccessPage';

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
        <AccessPage />
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
