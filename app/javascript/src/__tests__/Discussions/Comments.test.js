import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { CommentBox, CommentSection } from '../../components/Discussion/Comment';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

const commentBtn = jest.fn();
const props = {
  authState: { user: { imageUrl: 'someimagesource', userType: 'admin' } },
  sendComment: commentBtn,
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

describe('CommentBox', () => {
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

describe('CommentSection', () => {
  const commentsProps = {
    data: {
      user: { name: 'someimagesource', id: 'sdfjshds' },
      comment: 'This is another comment',
      imageUrl: 'https://dev.dgdp.site/activestorage',
      isAdmin: true,
      createdAt: '2020-08-08'
    },
    handleDeleteComment: jest.fn()
  };
  it('should render with wrong props', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <CommentSection {...commentsProps} />
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByText('someimagesource')).toBeInTheDocument();
    expect(container.queryByText('This is another comment')).toBeInTheDocument();
    expect(container.queryByTestId('delete_icon')).toBeInTheDocument();
    expect(container.queryByTestId('delete_icon').textContent).toContain('2020-08-08');
  });
});
