import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import routeData, { MemoryRouter } from 'react-router';
import UserAvatarOptions from '../Components/UserActionOptions';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/authstate'

describe('User Action Options Component', () => {
  const mockHistory = {
    push: jest.fn()
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });

  it('should render the user options component', () => {
    const container = render(
      <MockedProvider>
        <MemoryRouter>
          <Context.Provider value={userMock}>
            <UserAvatarOptions />
          </Context.Provider>
        </MemoryRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('avatar_menu')).toBeInTheDocument()
    expect(container.queryByTestId('user_avatar')).toBeInTheDocument()

    fireEvent.click(container.queryByTestId('user_avatar'))

    expect(container.queryByTestId('user_settings')).toBeInTheDocument()
    expect(container.queryByTestId('logout')).toBeInTheDocument()
    expect(container.queryByTestId('my_profile')).toBeInTheDocument()

    fireEvent.click(container.queryByTestId('user_settings'))
    expect(mockHistory.push).toBeCalled()
    expect(mockHistory.push).toBeCalledWith('/user/settings')

    fireEvent.click(container.queryByTestId('my_profile'))
    expect(mockHistory.push).toBeCalled()
    expect(mockHistory.push).toBeCalledWith('/user/11cdad78')

    fireEvent.click(container.queryByTestId('logout'))
    expect(mockHistory.push).toBeCalled()
    expect(mockHistory.push).toBeCalledWith('/logout')
  });
});
