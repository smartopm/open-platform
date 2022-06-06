/* eslint-disable */
import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'

import MessageList from '../../components/Messaging/MessageList'

describe('message list component', () => {
  it('should render properly', () => {
    const messages = [
      {
        message: 'Heyyyy there',
        isRead: true,
        dateMessageCreated: '2020-04-13',
        readAt: '2020-04-14',
        createdAt: '2020-04-14',
        id: '1124ff7d-0008-02b4c5a54b50',
        user: {
          id: 'b5ed9ea9-8b02-eb8bb4fed2c8',
          name: 'Doez JM'
        }
      }
    ]
   const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MessageList messages={messages} />
        </BrowserRouter>
      </MockedProvider>)

    expect(container.queryByText('common:misc.no_messages_in_community')).not.toBeInTheDocument()
  });


  it('should render properly when no messages', () => {
    const messages = []
    const container = render(
    <MockedProvider>
         <BrowserRouter>
           <MessageList messages={messages} />
         </BrowserRouter>
       </MockedProvider>)

     expect(container.queryByText('common:misc.no_messages_in_community')).toBeInTheDocument()
   });
})
