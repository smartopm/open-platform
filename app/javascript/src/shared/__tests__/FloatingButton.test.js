import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import FloatingButton from "../buttons/FloatingButton";

describe('Floating Button', () => {
  it('should render the Floating button', () => {
    const mock = jest.fn();
    const btn = render(<FloatingButton data-testid="float-btn" color="primary" handleClick={mock} />);

    expect(btn.queryByTestId('float-btn')).toBeTruthy();

    fireEvent.click(btn.queryByTestId('float-btn'))
    expect(mock).toBeCalled()
  });
});
