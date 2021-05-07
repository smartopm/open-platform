import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import UserAvatarOptions from '../Components/UserActionOptions';

describe('User Action Options Component', () => {
  it('should render the user options component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserAvatarOptions />
        </BrowserRouter>
      </MockedProvider>
    );
    
    expect(container.queryByTestId('icons')).toBeInTheDocument()

    fireEvent.click(container.queryByTestId('icons'))
    expect(container.queryByTestId('text')).toBeInTheDocument()
  });
});
