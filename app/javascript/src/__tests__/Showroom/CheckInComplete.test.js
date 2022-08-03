import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import CheckInComplete from '../../containers/showroom/CheckInComplete';

describe('CheckInComplete Component', () => {
  it('renders CheckInComplete texts', () => {
    const historyMock = { push: jest.fn() }
    const container = render(
      <BrowserRouter>
        <CheckInComplete history={historyMock} />
      </BrowserRouter>
    );

    expect(container.getByText(/Thank You for Checking In/)).toBeInTheDocument();
    expect(container.getByText(/Check-In Another Visitor/)).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('another_checkin_btn'))
    expect(historyMock.push).toBeCalled()
    expect(historyMock.push).toBeCalledWith('/sh_reason')
  });
});
