import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import ReactTestUtils from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import CommentField from '../modules/Tasks/Components/CommentField';

import { TaskComment } from '../graphql/mutations';
import { Context } from '../containers/Provider/AuthStateProvider';
import authState from '../__mocks__/authstate';

describe('Comment Field Component', () => {
  const mocks = [
    {
      request: {
        query: TaskComment,
        variables: { noteId: 'j83hdj3jhu334', body: 'new body' }
      },
      result: { data: { noteCommentCreate: { noteComment: { body: 'body' } } } }
    }
  ];
  const data = {
    taskComments: [
      {
        id: 'jwhekw',
        body: 'whgeukhw',
        createdAt: '2020-09-30T20:32:17Z',
        user: {
          imageUrl: '',
          name: 'tolulope'
        }
      }
    ]
  };

  it('render without error', async () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <CommentField
              authState={authState}
              data={data}
              refetch={jest.fn()}
              taskId="j83hdj3jhu334"
              taskDocuments={[{ id: '3456728dfg', display: 'doc-1' }]}
            />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    const body = container.queryByTestId('body_input');
    ReactTestUtils.Simulate.change(body, { target: { value: 'new body' } });
    expect(body.value).toBe('new body');
    const share = container.queryByTestId('comment_btn');
    expect(share).toBeInTheDocument();

    await waitFor(() => {
      fireEvent.click(share);
      expect(share).toBeDisabled();
    }, 20);
  });

  it('render with error', async () => {
    const errorMocks = [
      {
        request: {
          query: TaskComment,
          variables: { noteId: '', body: '', taggedDocuments: [] }
        },
        result: { data: { noteCommentCreate: { noteComment: { body: '' } } } }
      }
    ];
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={errorMocks} addTypename={false}>
          <BrowserRouter>
            <CommentField
              authState={authState}
              data={data}
              refetch={jest.fn}
              taskId="j83hdj3jhu334"
              taskDocuments={[{ id: '3456728dfg', display: 'doc-1' }]}
            />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    const body = container.queryByTestId('body_input');
    ReactTestUtils.Simulate.change(body, { target: { value: '' } });
    expect(body.value).toBe('');

    await waitFor(() => {
      const share = container.queryByTestId('comment_btn');
      expect(share).toBeInTheDocument();

      fireEvent.click(share);
    }, 10);
  });
});
