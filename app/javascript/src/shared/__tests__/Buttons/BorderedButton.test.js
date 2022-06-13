import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import BorderedButton from '../../buttons/BorderedButton';

describe('Button with custom border', () => {
  it('should check if the button renders properly', () => {
      const mock = jest.fn()
    const wrapper = render(
      <BorderedButton 
        data-testid="button_with_border" 
        title="This is a button" 
        borderColor="#FFFFFF"
        onClick={mock}
      />
    );

    expect(wrapper.queryByTestId('button_with_border')).toBeInTheDocument();
    expect(wrapper.queryByTestId('button_with_border').textContent).toContain('This is a button');
    fireEvent.click(wrapper.queryByTestId('button_with_border'))
    expect(mock).toBeCalled()
  });
});
