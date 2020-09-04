/* eslint-disable */
import React from 'react'
import { mount } from 'enzyme'
import { LoginScreen } from '../components/AuthScreens/LoginScreen'
import { createClient } from '../utils/apollo'
import { loginPhone } from '../graphql/mutations'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'

describe('Login screen', () => {
  const mocks = [
    {
      request: {
        query: loginPhone,
        variables: { phoneNumber: '260971500748' }
      },
      //  data.loginPhoneStart.user
      result: {
        data: {
          loginPhoneStart: {
            id: '11cdad78-5a04-4026-828c-17290a2c44b6',
            phoneNumber: '260971500748',
            __typename: 'User'
          }
        }
      }
    }
  ]
  const loginWrapper = mount(
    <BrowserRouter>
      <ApolloProvider client={createClient} mocks={mocks}>
        <LoginScreen />
      </ApolloProvider>
    </BrowserRouter>
  )
  it('should have a title of an h4', () => {
    expect(loginWrapper.find('h4')).toHaveLength(1)
  })
  it('should have a welcome text', () => {
    expect(loginWrapper.find('h4').text()).toContain('Welcome to Nkwashi')
  })
  it('should contain a nav with an arrow icon', () => {
    expect(loginWrapper.find('nav')).toHaveLength(1)
    expect(loginWrapper.find('nav').text()).toContain('arrow_back')
  })
  it('should have an input field that accepts numbers', () => {
    expect(loginWrapper.find('input')).toHaveLength(1)
    loginWrapper.find('input').simulate('change', {
      target: { value: '9297392' }
    })
    loginWrapper.find("input[type='tel']").getDOMNode().value = '9297392'
    expect(loginWrapper.find("input[type='tel']").getDOMNode().value).toEqual(
      '9297392'
    )
  })
  it('should have a button', () => {
    expect(loginWrapper.find('button').exists()).toBe(true)
  })
})
