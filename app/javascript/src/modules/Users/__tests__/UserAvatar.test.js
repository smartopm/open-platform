import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import UserAvatar from '../Components/UserAvatar';
import userMock from '../../../__mocks__/userMock';
import { Context } from '../../../containers/Provider/AuthStateProvider';

describe('User Avatar Component', () => {
  it('should render the user avatar component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Context.Provider value={userMock}>
            <UserAvatar imageUrl='image.jpg' user={userMock} />
          </Context.Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    
    expect(container.queryByTestId('user_avatar')).toBeInTheDocument()

    fireEvent.click(container.queryByTestId('user_avatar'))
  });
});
