import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import VisitReasonScreen from '../../containers/showroom/VisitReasonScreen';

describe('CheckInComplete Component', () => {
  it('renders CheckInComplete texts', () => {
    const historyMock = { push: jest.fn() }
    const container = render(
      <BrowserRouter>
        <VisitReasonScreen history={historyMock} />
      </BrowserRouter>
    );

    expect(container.getByText(/Why are you here today?/)).toBeInTheDocument();
    expect(container.getByText(/Visiting the Nkwashi Showroom/)).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('visit_btn'))
    expect(historyMock.push).toBeCalled()
    expect(historyMock.push).toHaveBeenCalledTimes(1)
  });
});
