import React from 'react'
import { render } from '@testing-library/react';
import Avatar, { safeAvatarLink } from '../components/Avatar'
import { Context } from '../containers/Provider/AuthStateProvider'
import userMock from '../__mocks__/userMock'
import '@testing-library/jest-dom/extend-expect';

describe('Avatar component', () => {
  it('should render a users custom avatar if available', () => {
    const customAvatar = 'http://host.com/image.jpg'
    const userData = {
      imageUrl: customAvatar,
    }
    
    const rendered = render(
      <Context.Provider value={userMock}>
        <Avatar user={userData} imageUrl={customAvatar} />
      </Context.Provider>
    )
    expect(rendered.queryByTestId('user_avatar')).toBeInTheDocument()
    expect(safeAvatarLink({ user: userData, imageUrl: customAvatar })).toContain('https')
    expect(safeAvatarLink({ imageUrl: customAvatar, user: {} })).toContain('https')
  })
})
