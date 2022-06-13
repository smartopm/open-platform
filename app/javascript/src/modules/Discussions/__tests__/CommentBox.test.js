import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import { BrowserRouter } from 'react-router-dom';
import CommentBox from '../Components/CommentBox';

describe('CommentBox', () => {
  const props = {
    authState: { user: { imageUrl: 'someimagesource', userType: 'admin' } },
    sendComment: jest.fn(),
    data: {
      message: 'I am a comment',
      isLoading: false
    },
    handleCommentChange: jest.fn(),
    upload: {
      handleFileUpload: jest.fn(),
      status: 'DONE',
      url: 'https://dev.dgdp.site/activestorage'
    }
  };
  it('should render with wrong props', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <CommentBox {...props} />
        </BrowserRouter>
      </MockedProvider>
    );
    // Todo: Use regex to match both Comment and Send to make sure it works well from message box
    expect(container.queryByText('common:misc.post')).toBeInTheDocument();
    expect(container.queryByText('common:misc.image_uploaded')).toBeInTheDocument();

    const comment = container.queryByTestId('post_content');
    fireEvent.change(comment, { target: { value: 'This is a good comment' } });
    expect(comment.value).toBe('This is a good comment');
  });
});
