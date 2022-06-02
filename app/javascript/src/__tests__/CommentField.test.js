import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import ReactTestUtils from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import CommentField from '../modules/Tasks/Components/CommentField';

import { TaskComment } from '../graphql/mutations';
import { Spinner } from '../shared/Loading';
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
            />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(
      () => {
        const body = container.queryByTestId('body_input');
        ReactTestUtils.Simulate.change(body, { target: { value: 'new body' } });
        expect(body.value).toBe('new body');

        const share = container.queryByTestId('comment_btn');
        expect(share).toBeInTheDocument();

        fireEvent.click(share);
        const loader = render(<Spinner />);

        expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
        expect(container.queryByText('new body')).toBeInTheDocument();
      }, 20);
  });

  it('render with error', async () => {
    const errorMocks = [
      {
        request: {
          query: TaskComment,
          variables: { noteId: '', body: '' }
        },
        result: { data: { noteCommentCreate: { noteComment: { body: 'body' } } } }
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
            />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    const body = container.queryByTestId('body_input');

    await waitFor(() => {
      ReactTestUtils.Simulate.change(body, { target: { value: 'new error body' } });
      expect(body.value).toBe('new error body');

      const share = container.queryByTestId('comment_btn');
      expect(share).toBeInTheDocument();

      fireEvent.click(share);
    }, 10);
  });
});
