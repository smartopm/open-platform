import React from 'react'
import { mount } from 'enzyme'
import { BrowserRouter } from 'react-router-dom'
import UserMessageItem from '../components/Messaging/UserMessageItem'

describe('user message item component', () => {
  const message =
    `Please share your feedback with this 30 seconds survey: https://app.doublegdp.com/news/posts/survey/ 
    and your email test@testdotcom.com`
  const data = {
    id: 1,
    name: 'joen',
    user: {},
    category: 'SMS',
    message,
    clientNumber: '2603434343',
    dateMessageCreated: new Date(),
    isTruncate: false,
    isAdmin: true
  }
  const messageItem = mount(
    <BrowserRouter>
      <UserMessageItem {...data} />
    </BrowserRouter>
  )
  it('should render the user messages items with props', () => {
    const {
      children: { props }
    } = messageItem.props()
    expect(props.id).toBe(data.id)
    expect(props.name).toBe(data.name)
    expect(props.clientNumber).toBe(data.clientNumber)
  })
  it('should include an image tag for the user avata', () => {
    expect(messageItem.find('img')).toBeTruthy()
  })
  it('message owner should contain children of spans', () => {
    expect(messageItem.find('.nz_msg_owner').children()).toHaveLength(3)
  })
  it('message element should only contain one child element', () => {
    expect(messageItem.find('.nz_msg').children()).toHaveLength(1)
  })

  it('message should display in full when isTruncate is false', () => {
    expect(messageItem.find('.nz_msg').text()).toBe(message)
  })
  it('message should include a linked url address', () => {
    expect(messageItem.find('.nz_msg').html().toString()).toContain('<a href="https://app.doublegdp.com/news/posts/survey/">https://app.doublegdp.com/news/posts/survey/</a>')
  })
  it('message should include a linked url address', () => {
    expect(messageItem.find('.nz_msg').html().toString()).toContain('<a href="mailto:test@testdotcom.com">test@testdotcom.com</a>')
  })
  it('displayes not seen if message not seen yet by the user', () => {
    expect(messageItem.find('.nz_read').text()).toBe('Not Read')
  })
  it('It should display SMS tag ', () => {
    expect(messageItem.find('.nz_msg_tag').first().text()).toBe('SMS')  
  })
  // new data

  const new_data = {
    id: 2,
    name: 'brieen',
    user: {
      userType: 'client'
    },
    message,
    clientNumber: '2603434343',
    dateMessageCreated: new Date(),
    isTruncate: true,
    isAdmin: true,
    isRead: true,
    readAt: new Date(),
    count: 40
  }

  const truncateMessageItem = mount(
    <BrowserRouter>
      <UserMessageItem {...new_data} />
    </BrowserRouter>
  )
  // nz_read
  it('message should be truncated when isTruncate is true', () => {
    expect(truncateMessageItem.find('.nz_msg').text()).toBe(
      'Please share your feedback with this 30 ...'
    )
  })

  it('shows admin the time when message was read at', () => {
    expect(truncateMessageItem.find('.nz_read').text()).toContain('Read')
  })

  it('shows admin the user type of the message owner', () => {
    expect(truncateMessageItem.find('.nz_msg_owner').text()).toContain('Client')
  })
})
