import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import UserAvatarOptions from '../Components/UserActionOptions';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/authstate'

describe('User Action Options Component', () => {
  it('should render the user options component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Context.Provider value={userMock}>
            <UserAvatarOptions />
          </Context.Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('avatar_menu')).toBeInTheDocument()

    fireEvent.click(container.queryByTestId('avatar_menu'))
    // expect(container.queryByTestId('user_settings')).toBeInTheDocument()
    // expect(container.queryByTestId('logout')).toBeInTheDocument()
  });
});
