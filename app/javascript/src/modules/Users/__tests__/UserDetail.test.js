import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import UserDetail from '../Components/UserDetail';

describe('User Detail Component', () => {
  const user = {
    id: '79o3bt4t',
    userType: 'admin',
    email: 'email@email.com',
    name: 'some name',
    phoneNumber: '08034065434'
  }
  it('should render the user detail component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserDetail user={user} />
        </BrowserRouter>
      </MockedProvider>
    );
    
    expect(container.queryByTestId('name')).toHaveTextContent('some name')

    fireEvent.click(container.queryByTestId('collapse'))
    expect(container.queryByTestId('email')).toHaveTextContent('email@email.com')
    expect(container.queryByTestId('phone')).toHaveTextContent('08034065434')
    expect(container.queryByTestId('user-type')).toHaveTextContent('admin')
  });
});
