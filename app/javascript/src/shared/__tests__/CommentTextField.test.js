import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CommentTextField from '../CommentTextField';
import { Context } from '../../containers/Provider/AuthStateProvider';
import authState from '../../__mocks__/authstate';

describe('CommentText Field component', () => {
  const props = {
    handleSubmit: jest.fn(),
    value: 'some description',
    setValue: jest.fn(),
    actionTitle: 'misc.comment',
    placeholder: 'comment'
  };

  it('should properly render the text field', () => {
    const wrapper = render(<CommentTextField {...props} />);
    expect(wrapper.queryByTestId('body_input')).toBeInTheDocument();
    expect(wrapper.queryByTestId('comment_btn')).toBeInTheDocument();
    expect(wrapper.queryByTestId('comment_btn').textContent).toContain('misc.comment');

    fireEvent.click(wrapper.queryByTestId('comment_btn'));
    expect(props.handleSubmit).toBeCalled();
  });

  it('should properly render "require a reply" section', () => {
    const fullProps = {
      ...props,
      forProcess: true,
      processesProps: {
        userData: {
          usersLite: [{ name: 'John Doe', id: '123' }]
        },
        searchUser: () => {},
        setSearchUser: () => {}
      },
    };

    const wrapper = render(
      <Context.Provider value={authState}>
        <CommentTextField {...fullProps} />
      </Context.Provider>
    )
    expect(wrapper.queryByTestId('require_reply')).toBeInTheDocument();
    expect(wrapper.queryByTestId('send_to_resident')).toBeInTheDocument();
    expect(wrapper.queryByTestId('users_autocomplete')).not.toBeInTheDocument();
  });

  it('should properly render autocomplete input', () => {
    const fullProps = {
      ...props,
      forProcess: true,
      processesProps: {
        userData: {
          usersLite: [{ name: 'John Doe', id: '123' }]
        },
        searchUser: () => {},
        setSearchUser: () => {}
      },
      commentOptions: {
        autoCompleteOpen: true,
        sendToResident: false
      }
    };

    const wrapper = render(<CommentTextField {...fullProps} />);
    expect(wrapper.queryByTestId('users_autocomplete')).toBeInTheDocument();
  });
});
