import React from 'react'
import { shallow } from 'enzyme'
import Avatar, { safeAvatarLink } from '../components/Avatar'

// rewrite this test
describe('Avatar component', () => {
  it('should render a users custom avatar if available', () => {
    const customAvatar = 'http://host.com/image.jpg'
    const googleAvatar = 'https://google.com/avatar.png'
    const userData = {
      imageUrl: googleAvatar, 
      avatarUrl: customAvatar
    }
    
    const rendered = shallow(<Avatar user={userData} imageUrl={customAvatar} />)
    expect(rendered.find('img').length).toBe(1)
    expect(rendered.find('img').props().src).toEqual(googleAvatar)
    expect(safeAvatarLink({ user: userData, imageUrl: customAvatar })).toContain('https')
    expect(safeAvatarLink({ imageUrl: customAvatar, user: {} })).toContain('https')
  })
})
