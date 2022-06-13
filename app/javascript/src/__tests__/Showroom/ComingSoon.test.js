import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import ComingSoon from '../../containers/showroom/ComingSoon';

describe('ComingSoon Component', () => {
  it('renders ComingSoon texts', () => {
    const historyMock = { push: jest.fn() }
    const container = render(
      <BrowserRouter>
        <ComingSoon history={historyMock} />
      </BrowserRouter>
    );

    expect(container.getByText(/Thanks for coming in! Our team will help/)).toBeInTheDocument();
    expect(container.queryByTestId('go_back_btn').textContent).toContain('Go Back')
    fireEvent.click(container.queryByTestId('go_back_btn'))
    expect(historyMock.push).toBeCalled()
    expect(historyMock.push).toBeCalledWith('/sh_reason')
  });
});
