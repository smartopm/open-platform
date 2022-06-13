import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import AutoSaveField from '../../shared/AutoSaveField';

describe('AutoSaveField component', () => {
  it('should properly render the auto save field', async () => {
    const props = {
      value: 'some description',
      mutationAction: jest.fn(),
      stateAction: jest.fn(),
    };

    const container = render(<AutoSaveField {...props} />);
    const editableField = container.queryByTestId('live_editable_field');
    const editableFieldTextInput = container.queryByTestId('live-text-field');
    
    expect(editableField).toBeInTheDocument();
    expect(editableFieldTextInput).toBeInTheDocument();

    fireEvent.mouseLeave(editableField)
    expect(props.stateAction).toHaveBeenCalled();
    
    fireEvent.mouseEnter(editableField)
    fireEvent.change(editableFieldTextInput, { target: { value: 'another description' } })
    expect(editableFieldTextInput.value).toBe('another description')
  });
});
