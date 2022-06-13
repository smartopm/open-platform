import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import { BrowserRouter } from 'react-router-dom';
import  CommentSection from '../Components/CommentSection';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('CommentSection', () => {
  const commentsProps = {
    data: {
      user: { name: 'someimagesource', id: 'sdfjshds' },
      comment: 'This is another comment',
      imageUrl: 'https://dev.dgdp.site/activestorage',
      isAdmin: true,
      createdAt: '2020-08-08',
      accessibility: 'everyone'
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
    expect(container.queryByTestId('post_options')).toBeInTheDocument();

    fireEvent.click(container.queryByText('form_actions.edit_post'))
    fireEvent.click(container.queryByText('form_actions.delete_post'))
    expect(commentsProps.handleDeleteComment).toBeCalled();
  });
});
