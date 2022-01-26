import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CommentTextField from '../CommentTextField';

describe('CommentText Field component', () => {
  it('should properly render the text field', () => {
    const props = {
      handleSubmit: jest.fn(),
      value: 'some description',
      setValue: jest.fn()
    };

    const wrapper = render(<CommentTextField {...props} />);
    expect(wrapper.queryByTestId('body_input')).toBeInTheDocument();
    expect(wrapper.queryByTestId('comment_btn')).toBeInTheDocument();
    expect(wrapper.queryByTestId('comment_btn').textContent).toContain('misc.comment');

    fireEvent.click(wrapper.queryByTestId('comment_btn'))
    expect(props.handleSubmit).toBeCalled()
  });
});
