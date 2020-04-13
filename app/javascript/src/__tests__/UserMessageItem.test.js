import React from 'react'
import { mount } from 'enzyme'
import { BrowserRouter } from 'react-router-dom'
import UserMessageItem from '../components/Messaging/UserMessageItem'

describe('user message item component', () => {
  const message =
    'Please share your feedback with this 30 seconds survey: https://app.doublegdp.com/news/posts/survey/'
  const data = {
    id: 1,
    name: 'joen',
    user: {},
    message,
    clientNumber: '2603434343',
    dateMessageCreated: new Date(),
    isTruncate: false
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
    expect(messageItem.find('.nz_msg_owner').children()).toHaveLength(2)
  })
  it('message element should only contain one child element', () => {
    expect(messageItem.find('.nz_msg').children()).toHaveLength(1)
  })

  it('message should display in full when isTruncate is false', () => {
    expect(messageItem.find('.nz_msg').text()).toBe(message)
  })

  // new data

  const new_data = {
    id: 2,
    name: 'brieen',
    user: {},
    message,
    clientNumber: '2603434343',
    dateMessageCreated: new Date(),
    isTruncate: true
  }

  const truncateMessageItem = mount(
    <BrowserRouter>
      <UserMessageItem {...new_data} />
    </BrowserRouter>
  )

  it('message should be truncated when isTruncate is true', () => {
    expect(truncateMessageItem.find('.nz_msg').text()).toBe(
      'Please share your feedback with this 30 ...'
    )
  })
})
