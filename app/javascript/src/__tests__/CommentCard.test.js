import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import CommentCard from '../modules/Tasks/Components/CommentCard';

import { Context } from '../containers/Provider/AuthStateProvider';
import authState from '../__mocks__/authstate';

describe('Comment Card Component', () => {
  it('render without error', () => {
    const comments = [
      {
      id: 'jwhekw',
      body: 'body',
      createdAt: "2020-09-30T20:32:17Z",
      user: {
        imageUrl: '',
        name: 'name'
        }
      },
    ];
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <CommentCard
              comments={comments}
              refetch={jest.fn}
            />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    )

    expect(container.getByTestId('comment-body')).toBeInTheDocument();
    fireEvent.click(container.getByTestId('more_details'))
    const edit = container.queryByTestId('edit')
    const deleteButton = container.queryByTestId('delete')
    expect(edit).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(edit)
    const cancel = container.queryByTestId('cancel')
    expect(cancel).toBeInTheDocument();
    fireEvent.click(cancel)
    expect(cancel).not.toBeInTheDocument();

    fireEvent.click(container.queryByTestId('delete'))
    expect(container.queryByText('task.delete_confirmation_text')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('cancel-delete'))
    expect(container.queryByText('task.delete_confirmation_text')).not.toBeInTheDocument();
  })

  it('displays "NEEDS REPLY" label', () => {
    const comments = [
      {
      id: 'jwhekw',
      body: 'body',
      createdAt: "2020-09-30T20:32:17Z",
      user: {
        imageUrl: '',
        name: 'name'
        },
        repliedAt: null,
        replyFrom: {
          name: 'Nurudeen'
        },
        replyRequired: true
      },
    ];
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <CommentCard
              comments={comments}
              refetch={jest.fn}
            />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    )
    expect(container.getByTestId('needs_reply_text')).toBeInTheDocument();
  })

  it('displays "Replied" label', () => {
    const comments = [
      {
      id: 'jwhekw',
      body: 'body',
      createdAt: "2020-09-30T20:32:17Z",
      user: {
        imageUrl: '',
        name: 'name'
        },
        repliedAt: "2020-09-30T20:32:17Z",
        replyFrom: {
          name: 'Nurudeen'
        },
        replyRequired: true
      },
    ];
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <CommentCard
              comments={comments}
              refetch={jest.fn}
              forAccordionSection
            />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    )
    expect(container.getByTestId('replied_text')).toBeInTheDocument();
    expect(container.getByTestId('resolve-icon')).toBeInTheDocument();
    expect(container.getByTestId('comments-resolved-text')).toBeInTheDocument();
  })

  it('displays reply and resolve-comments buttons', () => {
    const comments = [
      {
      id: 'jwhekw',
      body: 'body',
      createdAt: "2020-09-30T20:32:17Z",
      user: {
        imageUrl: '',
        name: 'name'
        },
        repliedAt: null,
        replyFrom: {
          id: authState.user.id,
          name: 'Nurudeen'
        },
        replyRequired: true,
        groupingId: 'jwhekw'
      },
    ];
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <CommentCard
              comments={comments}
              refetch={jest.fn}
              forAccordionSection
            />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    )
    expect(container.getByTestId('reply_btn')).toBeInTheDocument();
    expect(container.getByTestId('resolve_btn')).toBeInTheDocument();
  })
})
