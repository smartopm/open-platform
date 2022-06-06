import React from 'react'
import { render } from '@testing-library/react';
import Avatar, { safeAvatarLink } from '../components/Avatar'
import { Context } from '../containers/Provider/AuthStateProvider'
import userMock from '../__mocks__/userMock'


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
  it('should render a searched user avatar if available in Auth', () => {
    const customAvatar = 'http://host.com/image.jpg'
    const userData = {
      imageUrl: customAvatar,
    }
    const searchedUser = {
      imageUrl: customAvatar,
    }

    const rendered = render(
      <Context.Provider value={userMock}>
        <Avatar user={userData} imageUrl={customAvatar} searchedUser={searchedUser} />
      </Context.Provider>
    )
    expect(rendered.queryByTestId('searched_auth_user_avatar')).toBeInTheDocument()
    expect(safeAvatarLink({ imageUrl: searchedUser.imageUrl })).toContain('https')
  })
  it('should render a searched user avatar if available by upload', () => {
    const customAvatar = 'http://host.com/image.jpg'
    const searchedUser = {
      avatarUrl: customAvatar,
    }

    render(
      <Context.Provider value={userMock}>
        <Avatar searchedUser={searchedUser} />
      </Context.Provider>
    )
    expect(safeAvatarLink({ imageUrl: searchedUser.avatarUrl })).toContain('https')
  })
  it('should render a default avatar for searched user avatar if not available', () => {
    const customAvatar = 'http://host.com/image.jpg'
    const defaultAvatar = 'http://host.com/default_avatar.svg'
    const userData = {
      imageUrl: customAvatar,
    }
    const searchedUser = {
      avatarUrl: null,
      imageUrl: null,
    }

    const rendered = render(
      <Context.Provider value={userMock}>
        <Avatar user={userData} imageUrl={customAvatar} searchedUser={searchedUser} />
      </Context.Provider>
    )
    expect(rendered.queryByTestId('searched_default_user_avatar')).toBeInTheDocument()
    expect(safeAvatarLink({ imageUrl: defaultAvatar })).toContain('https')
  })
})
