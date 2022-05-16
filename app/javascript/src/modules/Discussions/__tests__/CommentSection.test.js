import React from 'react';
import { render } from '@testing-library/react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { CommentMutation, UpdateCommentMutation } from '../../../graphql/mutations';
import { commentStatusAction } from '../../../utils/constants';
import Comments from '../Components/Comment';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { createClient } from '../../../utils/apollo';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Main Discussion Comment Section', () => {
  it('should check the whole comment part of the discussion', () => {
    const comments = [
      {
        content: 'uploaded that beautiful image',
        createdAt: '2020-12-11T04:49:42Z',
        id: 'fe0bf524-1a5d-4104-b62f-c9896e082824',
        user: {
          id: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
          name: 'joe jui al'
        }
      },
      {
        content: 'another cool image',
        createdAt: '2020-12-09T17:22:50Z',
        id: '9149c814-ddda-4b4d-8b99-996ca2bc6dc5',
        user: {
          id: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
          name: 'joe jui al'
        }
      }
    ];
    const refetch = jest.fn();
    const other = { discussionId: 'sdjfh92323-43r23423-0sdw' };
    const createCommentMock = {
      request: {
        query: CommentMutation,
        variables: {
          content: 'here is some comment',
          discussionId: other.discussionId,
          imageBlobId: 'signedBlobId'
        }
      },
      result: { data: { commentCreate: { comment: { content: 'here is some comment' } } } }
    };

    const updateCommentMock = {
      request: {
        query: UpdateCommentMutation,
        variables: {
          commentId: comments[0].id,
          discussionId: other.discussionId,
          status: commentStatusAction.delete
        }
      },
      result: { data: { commentUpdate: { success: true } } }
    };

    const user = {
      loggedIn: true,
      loaded: true,
      user: {
        userType: 'admin'
      },
    };
    // mock react router and add tests
    // or find where the comments is being used and pass the id as a prop instead of direct access
    render(
      <ApolloProvider client={createClient}>
        <BrowserRouter>
          <Context.Provider value={user}>
            <MockedProvider mocks={[createCommentMock, updateCommentMock]}>
              <BrowserRouter>
                <Comments refetch={refetch} comments={comments} discussionId={other.discussionId} />
              </BrowserRouter>
            </MockedProvider>
          </Context.Provider>
        </BrowserRouter>
      </ApolloProvider>
    );
  });
});
