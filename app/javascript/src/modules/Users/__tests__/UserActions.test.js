import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UserActions, { UserOptions } from '../Components/UserActions';

describe('User Actions Component', () => {
  it('should render the user actions component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserActions />
        </BrowserRouter>
      </MockedProvider>
    );
    
    expect(container.queryByTestId('user_avatar')).toBeInTheDocument()
    expect(container.queryByTestId('text')).toBeInTheDocument()
  });

  it('should render the user options component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserOptions icon={<AccountCircleIcon />} primaryText="Hello" secondaryText="Hello again" handleClick={jest.fn} />
        </BrowserRouter>
      </MockedProvider>
    );
    
    expect(container.queryByTestId('icons')).toBeInTheDocument()
    expect(container.queryByTestId('caption')).toBeInTheDocument()

    fireEvent.click(container.queryByTestId('options'))
  });
});
