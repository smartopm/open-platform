import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import Home from '../../containers/showroom/Home';

describe('Home Component', () => {
  it('renders Home texts', () => {
    const historyMock = { push: jest.fn() }
    const container = render(
      <BrowserRouter>
        <Home history={historyMock} />
      </BrowserRouter>
    );

    expect(container.getByText(/Welcome to Thebe Investment Management/)).toBeInTheDocument();
    expect(container.getByText(/Press Here to Check-In/)).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('checkin_btn'))
    expect(historyMock.push).toBeCalled()
    expect(historyMock.push).toBeCalledWith('/sh_reason')
    expect(historyMock.push).toHaveBeenCalledTimes(1)
  });
});
