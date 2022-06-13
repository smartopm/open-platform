import React from 'react';
import { render } from '@testing-library/react';
import AddMoreButton from "../buttons/AddMoreButton";

describe('AddmoreButton', () => {
  it('should render the add more button', () => {
    const mock = jest.fn();
    const btn = render(<AddMoreButton handleAdd={mock} title="Add more users" />);
    expect(btn.queryByRole('button').textContent).toContain('Add more users');
  });
});
