import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { PostCreateMutation, PostUpdateMutation } from '../../../graphql/mutations';
import PostCreate from '../Components/PostCreate';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar';

describe('PostCreate component', () => {
  it('should call the mutation', async () => {
    const translate = () => 'some-text';

    const mocks = [
      {
        request: {
          query: PostCreateMutation,
          variables: {
            content: '',
            discussionId: '12456484',
            imageBlobIds: []
          }
        },
        result: { data: { postCreate: { post: { content: 'Some post here' } } } }
      }
    ];
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MockedThemeProvider>
          <MockedSnackbarProvider>
            <PostCreate
              translate={translate}
              currentUserImage="https://image-url.com"
              userPermissions={[{ module: 'discussion', permissions: ['can_set_accessibility'] }]}
              btnBorderColor="#575757"
              refetchNews={() => {}}
            />
          </MockedSnackbarProvider>
        </MockedThemeProvider>
      </MockedProvider>
    );

    expect(container.queryByTestId('whats-happening-btn')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('whats-happening-btn'));

    await waitFor(() => {
      expect(container.queryByTestId('post-btn')).toBeInTheDocument();
      expect(container.queryByTestId('cancel-btn')).toBeInTheDocument();

      expect(container.queryByTestId('post-btn')).toBeDisabled();
    }, 10);
  });

  it('should edit a post', async () => {
    const translate = () => 'some-text';
    const postData = {
      id: "bhdwkfdw",
      content: "some content",
      accessibility: "everyone",
    }

    const mocks = [
      {
        request: {
          query: PostCreateMutation,
          variables: {
            content: '',
            discussionId: '12456484',
            imageBlobIds: []
          }
        },
        result: { data: { postCreate: { post: { content: 'Some post here' } } } }
      },
      {
        request: {
          query: PostUpdateMutation,
          variables: {
            content: '',
            id: ""
          }
        },
        result: { data: { postCreate: { post: { content: 'Some post here' } } } }
      }
    ];
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MockedThemeProvider>
          <MockedSnackbarProvider>
            <PostCreate
              translate={translate}
              currentUserImage="https://image-url.com"
              btnBorderColor="#575757"
              refetchNews={() => {}}
              isMobile={false}
              postData={postData}
              editModal
              setPostData={jest.fn()}
              setEditModal={jest.fn()}
              setAnchorEl={jest.fn()}
              userPermissions={[{ module: 'discussion', permissions: ['can_set_accessibility'] }]}
            />
          </MockedSnackbarProvider>
        </MockedThemeProvider>
      </MockedProvider>
    );

    expect(container.queryByTestId('whats-happening-btn')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('whats-happening-btn'));

    await waitFor(() => {
      expect(container.queryByTestId('post-btn')).toBeInTheDocument();
      expect(container.queryByTestId('cancel-btn')).toBeInTheDocument();
      expect(container.queryByTestId('ArrowDropDownIcon')).toBeInTheDocument();
      expect(container.queryByTestId('VisibilityIcon')).toBeInTheDocument();

      expect(container.queryByTestId('post-btn')).not.toBeDisabled();
    }, 10);
  });
});
