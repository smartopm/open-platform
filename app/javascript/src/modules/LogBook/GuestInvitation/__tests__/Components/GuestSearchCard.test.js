import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import GuestSearchCard from '../../Components/GuestSearchCard';

describe('Render guest Card Component', () => {
  it('should render the Render guest  card component', async () => {
    const guest = {
      id: 'adada',
      name: 'Guest 1',
      imageUrl: 'https://image.com'
    };
    const invite = jest.fn();
    const t = jest.fn(() => 'translated');
    const container = render(
      <BrowserRouter>
        <GuestSearchCard
          guest={guest}
          translate={t}
          styles={{ card: 'some' }}
          handInviteGuest={invite}
        />
      </BrowserRouter>
    );

    expect(container.getByTestId('guest_avatar')).toBeInTheDocument();
    expect(container.getByTestId('guest_name')).toBeInTheDocument();
    expect(container.getByTestId('invite_guest_btn')).toBeInTheDocument();
    expect(container.getByTestId('invite_guest_btn').textContent).toContain('translated');

    fireEvent.click(container.getByTestId('invite_guest_btn'))
    expect(invite).toBeCalled()
    expect(invite).toBeCalledWith(guest)
  });
});
