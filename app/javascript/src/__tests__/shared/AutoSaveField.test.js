import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

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
    
    fireEvent.mouseEnter(editableField)
    fireEvent.change(editableFieldTextInput, { target: { value: 'another description' } })
    expect(editableFieldTextInput.value).toBe('another description')
  });

  it('should render inline editable', async () => {
    const props = {
      value: 'inline description',
      mutationAction: jest.fn(),
      stateAction: jest.fn(),
      fieldType: 'inline',
      canEdit: true
    };

    render(<AutoSaveField {...props} />);

    const inlineField = screen.queryByTestId('inline-editable-field');
    
    
    expect(inlineField).toBeInTheDocument();
    
    fireEvent.mouseLeave(inlineField)
    
    fireEvent.mouseEnter(inlineField)
    fireEvent.change(inlineField, { target: { innerHTML: 'another description' } })
    expect(inlineField.textContent).toBe('another description')
  });
});
