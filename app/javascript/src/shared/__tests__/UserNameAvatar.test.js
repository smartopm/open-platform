import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import UserNameAvatar from "../UserNameAvatar";

describe('UserNameAvatar', () => {
  const user = {
    id: 'hweh2ui2',
    name: "sample-name",
    imageUrl: "image.jpg"
  }
  it('renders UserNameAvatar', async () => {
    const container = render(
      <BrowserRouter>
        <UserNameAvatar user={user} />
      </BrowserRouter>
    );

    expect(container.queryByTestId('avatar')).toBeInTheDocument();
    expect(container.queryByTestId('name')).toBeInTheDocument();
  });
});