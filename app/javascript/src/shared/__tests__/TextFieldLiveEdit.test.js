import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import TextFieldLiveEdit from '../TextFieldLiveEdit';

describe('It should render Textfield live edit', () => {
  it('should render Textfield live edit component', () => {
    const container = render(
      <TextFieldLiveEdit 
        text='sample-text' 
        placeHolderText='sample-placeholder-text'
        textVariant='caption'
        textFieldVariant='outlined'
        fullWidth 
        handleChange={jest.fn()}
        name='text'
        multiline
        rows={2}
      />
    );

    expect(container.queryByTestId('live-field-input')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('live-field-input'));
    expect(container.queryByTestId('live-field-input')).toBeInTheDocument();
  });
});

