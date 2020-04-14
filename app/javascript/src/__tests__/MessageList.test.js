import React from 'react'
import { mount, shallow } from 'enzyme'
import { BrowserRouter } from 'react-router-dom'
import MessageList from '../components/Messaging/MessageList'

describe('message list component', () => {
  const messages = [
    {
      message: 'Heyyyy there',
      isRead: true,
      dateMessageCreated: '2020-04-13',
      readAt: '2020-04-14',
      id: '1124ff7d-0008-02b4c5a54b50',
      user: {
        id: 'b5ed9ea9-8b02-eb8bb4fed2c8',
        name: 'Doez JM'
      }
    }
  ]

  const messagesList = shallow(
    <BrowserRouter>
      <MessageList messages={messages} />
    </BrowserRouter>
  )
  it('message list component should render just fine', () => {
    expect(messagesList).toMatchSnapshot()
  })
  it('shouldn\' show no message text when messages are provided', () => {
    expect(messagesList.find('.nz_no_msg')).toHaveLength(0)
  })
  it('should show no messages when given an empty array', () => {
    const messages = []
    const EmptyMessagesList = mount(<MessageList messages={messages} />)
    expect(EmptyMessagesList.find('.nz_no_msg').text()).toContain('No messages')
  })
})
