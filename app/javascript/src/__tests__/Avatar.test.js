import React from 'react'

import { shallow } from 'enzyme'

import Avatar from '../components/Avatar.jsx'

describe('Avatar component', function() {
  it('should render a users custom avatar if available', function() {
    const customAvatar = 'https://host.com/image.jpg'
    const googleAvatar = 'https://google.com/avatar.png'
    const userData = {
      imageUrl: googleAvatar,
      avatarUrl: customAvatar
    }
    const rendered = shallow(<Avatar user={userData} />)
    expect(rendered.find('img').length).toBe(1)
    expect(rendered.find('img').props().src).toEqual(customAvatar)
  })
})
