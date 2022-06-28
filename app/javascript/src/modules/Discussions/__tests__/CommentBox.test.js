import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import routeData, { MemoryRouter } from 'react-router';
import CommentBox from '../Components/CommentBox';

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
describe('CommentBox for discussion', () => {
    beforeEach(() => {
      const mockLocation = {
        pathname: '/discussion',
      };
      jest.spyOn(routeData, 'useLocation').mockReturnValue(mockLocation);
    });
  it('should render with wrong props', () => {
    const container = render(
      <MockedProvider>
        <MemoryRouter>
          <CommentBox {...props} />
        </MemoryRouter>
      </MockedProvider>
    );
    // Todo: Use regex to match both Comment and Send to make sure it works well from message box
    expect(container.queryByText('common:misc.post')).toBeInTheDocument();
    expect(container.queryByText('common:misc.image_uploaded')).toBeInTheDocument();
    expect(container.queryByTestId('discussion_upload')).toBeInTheDocument();

    const comment = container.queryByTestId('post_content');
    fireEvent.change(comment, { target: { value: 'This is a good comment' } });
    expect(props.handleCommentChange).toBeCalled()
  });
});

describe('Comment Box Message', () => {
  beforeEach(() => {
    const mockLocation = {
      pathname: '/message'
    };
    jest.spyOn(routeData, 'useLocation').mockReturnValue(mockLocation);
  });
  it('should show send for messages', () => {
    const container = render(
      <MockedProvider>
        <MemoryRouter>
          <CommentBox {...props} />
        </MemoryRouter>
      </MockedProvider>
    );
    expect(container.queryByTestId('discussion_upload')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.send')).toBeInTheDocument();
  });
});
