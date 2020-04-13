import React from 'react'
import { mount } from 'enzyme'
import { BrowserRouter } from 'react-router-dom'
import UserMessageItem from '../components/Messaging/UserMessageItem'

describe('user message item component', () => {
  const data = {
    id: 1,
    name: 'joen',
    user: {},
    message: 'hello there',
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
  it('should contain children of spans', () => {
    expect(messageItem.find('.nz_msg_owner').children()).toHaveLength(2)
  })
})
