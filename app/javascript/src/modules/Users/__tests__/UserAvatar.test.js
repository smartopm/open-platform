import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import UserAvatar from '../Components/UserAvatar';

describe('User Avatar Component', () => {
  it('should render the user avatar component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserAvatar imageUrl='image.jpg' />
        </BrowserRouter>
      </MockedProvider>
    );
    
    expect(container.queryByTestId('avatar')).toBeInTheDocument()

    fireEvent.click(container.queryByTestId('avatar'))
  });
});
