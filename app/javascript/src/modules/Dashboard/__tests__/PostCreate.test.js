import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { PostCreateMutation } from '../../../graphql/mutations';
import PostCreate from '../Components/PostCreate';
import MockedThemeProvider from '../../__mocks__/mock_theme';

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
          <PostCreate
            translate={translate}
            currentUserImage="https://image-url.com"
            userPermissions={[{ module: 'discussion', permissions: ['can_set_accessibility'] }]}
            btnBorderColor="#575757"
            refetchNews={() => {}}
          />
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
});
