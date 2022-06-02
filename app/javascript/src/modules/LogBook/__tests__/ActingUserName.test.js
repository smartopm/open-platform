import React from 'react';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import ActingUserName from '../Components/ActingUserName';

describe('ActingUserName', () => {
  const entryRequest = {
    guestId: 'some ids here',
    grantor: {
      id: 'Joe92381232',
      name: 'Joe D'
    }
  };
  const actingUser = {
    id: '823792',
    name: 'Jane Di'
  };
  const exitedProps = {
    entry: {
      actingUser,
      entryRequest,
      data: {
        note: 'Exited'
      }
    },
    t: jest.fn(() => 'some text')
  };

  it('should render acting user when it is an exit entry', () => {
    const wrapper = render(
      <BrowserRouter>
        <ActingUserName {...exitedProps} />
      </BrowserRouter>
    );
    expect(wrapper.queryByTestId('acting_user_name').textContent).toContain('Jane Di');
    expect(wrapper.queryByTestId('acting_guard_title').textContent).toContain('some text');
  });
  it('should render grantor for entry requests', () => {
    const props = {
      entry: {
        entryRequest,
        actingUser
      },
      data: {
        note: 'Some other type of observation'
      },
      t: jest.fn(() => 'some text')
    };
    const wrapper = render(
      <BrowserRouter>
        <ActingUserName {...props} />
      </BrowserRouter>
    );
    expect(wrapper.queryByTestId('acting_user_name').textContent).toContain('Joe D');
  });
  it('should render acting user for all other types of logs', () => {
    const props = {
      entry: {
        entryRequest: null,
        actingUser
      },
      data: {
        note: 'Some other type of observation'
      },
      t: jest.fn(() => 'some text')
    };
    const wrapper = render(
      <BrowserRouter>
        <ActingUserName {...props} />
      </BrowserRouter>
    );
    expect(wrapper.queryByTestId('acting_user_name').textContent).toContain('Jane Di');
  });
});
