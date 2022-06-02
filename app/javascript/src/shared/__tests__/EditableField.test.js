import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import EditableField from "../EditableField";

describe('Editable Field component', () => {
  it('should properly render the text field', () => {
    const updateMock = jest.fn()
    const props = {
      canUpdateNote: true,
      value: 'some description',
      setValue: jest.fn(),
      action: <button type="button" data-testid="update_btn" onClick={updateMock}>update me</button>
    };

    const wrapper = render(<EditableField {...props} />);
    expect(wrapper.queryByTestId('editable_description')).toBeInTheDocument();

    fireEvent.mouseEnter(wrapper.queryByTestId('editable_description'));
    expect(wrapper.queryByTestId('edit_icon')).toBeInTheDocument();

    fireEvent.change(wrapper.queryByTestId('editable_description'))
    fireEvent.click(wrapper.queryByTestId('edit_icon'))
    expect(wrapper.queryByTestId('edit_action')).toBeInTheDocument();

    expect(wrapper.queryByTestId('update_btn')).toBeInTheDocument();
    expect(wrapper.queryByTestId('update_btn').textContent).toContain('update me');
    fireEvent.click(wrapper.queryByTestId('update_btn'))
    expect(updateMock).toBeCalled()

    fireEvent.mouseLeave(wrapper.queryByTestId('editable_field_section'))
    // the update button should not be visible when we exit the description section
    expect(wrapper.queryByTestId('edit_action')).not.toBeInTheDocument();
  });
});
