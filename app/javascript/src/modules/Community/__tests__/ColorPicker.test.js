import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ReactTestUtils from 'react-dom/test-utils'
import ColorPicker from '../components/ColorPicker';

describe('Color Picker', () => {
  it('should have test Colour picker component', () => {
    const container = render(
      <ColorPicker color='#FFFFFF' handleColor={jest.fn()} />
    );

    ReactTestUtils.Simulate.change(container.queryByTestId('color'), {
      target: { value: '#FFF' }
    });

    fireEvent.click(container.queryAllByTestId('col')[0])
    expect(container.queryByTestId('color')).toBeInTheDocument('#FFF');
  });
});
