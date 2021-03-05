import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
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

    expect(container.getByText(/Why are you here today/)).toBeInTheDocument();
    expect(container.getByText(/Visiting the Nkwashi Showroom/)).toBeInTheDocument();
    expect(container.getByText(/Why are you here today?/)).toBeInTheDocument();
    expect(container.queryByTestId('payment_btn').textContent).toContain(
      'Payments & Account Management'
    );
    expect(container.queryByTestId('other').textContent).toContain('Other');
    expect(container.queryByTestId('payment_btn')).not.toBeDisabled()
    fireEvent.click(container.queryByTestId('payment_btn'))
    expect(historyMock.push).toBeCalled()
    fireEvent.click(container.queryByTestId('other'))
    expect(historyMock.push).toBeCalled()
    fireEvent.click(container.queryByTestId('visit_btn'))
    expect(historyMock.push).toBeCalled()
    expect(historyMock.push).toHaveBeenCalledTimes(3)
  });
});
