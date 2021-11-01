import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import RenderGuest from '../../Components/GuestUser';

describe('Render guest Component', () => {
  it('should render the Render guest component', async () => {
    const guest = {
      id: 'adada',
      name: 'Guest 1',
      imageUrl: 'https://image.com'
    };
    const invite = jest.fn();
    const t = jest.fn(() => 'translated');
    const guestInv = RenderGuest(guest, invite, t)[0];

    const avatar = render(guestInv.Avatar);
    const guestName = render(<BrowserRouter>{guestInv.GuestName}</BrowserRouter>);
    const action = render(guestInv.Action);

    expect(avatar.getByTestId('guest_avatar')).toBeInTheDocument();
    expect(guestName.getByTestId('guest_name')).toBeInTheDocument();
    expect(action.getByTestId('access_actions')).toBeInTheDocument();
    expect(action.getByTestId('grant_access_btn')).toBeInTheDocument();
  });
});
