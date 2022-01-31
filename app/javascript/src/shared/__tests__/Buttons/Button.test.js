import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ButtonComponent from "../../buttons/Button";

describe('AddmoreButton', () => {
  it('should render the add more button', () => {
    const mock = jest.fn();
    const btn = render(<ButtonComponent color="primary" handleClick={mock} buttonText="Add more users" />);
    expect(btn.queryByRole('button').textContent).toContain('Add more users');
    fireEvent.click(btn.queryByRole('button'))
    expect(mock).toBeCalled()
  });
});
