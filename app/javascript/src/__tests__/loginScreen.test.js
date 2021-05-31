import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { mount } from 'enzyme'
import LoginScreen from '../components/AuthScreens/LoginScreen'
import { loginPhone } from '../graphql/mutations'
import { CurrentCommunityQuery } from '../modules/Community/graphql/community_query';

// Todo: update this to use testing-library for better tests
describe('Login screen', () => {
  const mocks = [
    {
      request: {
        query: loginPhone,
        variables: { phoneNumber: '26000000748' }
      },
      result: {
        data: {
          loginPhoneStart: {
            id: '11cdad78-5a04-4026-828c-17290a2c44b6',
            phoneNumber: '26000000748',
          }
        }
      }
    },
    {
      request: {
        query: CurrentCommunityQuery
      },
      result: {
        data: {
          currentCommunity: {
            imageUrl: 'https://dev.dgdp.site/rails/active_storage/blobs/eyJ.png',
            id: '8d66a68a-ded4-4f95-b9e2-62811d2f395f',
            name: 'Test Community',
            supportEmail: [{email: 'support@test.com', category: 'customer_care'}],
            supportWhatsapp: [{email: 'support@test.com', category: 'customer_care'}],
            supportNumber: [{email: 'support@test.com', category: 'customer_care'}],
            currency: 'kwacha',
            locale: 'en-ZM',
            tagline: 'This is a tagline for this community',
            logoUrl: '',
            language: 'en-US',
            wpLink: '',
            themeColors: {
              primaryColor: "#FFFFFF",
              secondaryColor: "#FFFFFF"
            },
            features: []
          }
        }
      }
    }
  ]

  const loginWrapper = mount(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BrowserRouter>
        <LoginScreen />
      </BrowserRouter>
    </MockedProvider>
    )
  it('should have a title of an h4', () => {
    expect(loginWrapper.find('h4')).toHaveLength(1);
  })
  it('should have a welcome text', async () => {
    await waitFor(() => {
      // using the example give here https://github.com/i18next/react-i18next/blob/master/example/test-jest/src/UseTranslation.test.js#L9
      // files are tested by placeholders of translations
      expect(loginWrapper.find('h4').text()).toContain('login.welcome')
      expect(loginWrapper.text()).toContain('This is a tagline for this community')
      expect(loginWrapper.text()).toContain('login.login_text')
      expect(loginWrapper.text()).toContain('login.login_google')
      expect(loginWrapper.text()).toContain('login.login_facebook')
      expect(loginWrapper.text()).toContain('login.request_account')
    }, 10);
  })
  // it('should contain a nav with an arrow icon', () => {
  //   expect(loginWrapper.find('nav')).toHaveLength(1)
  //   expect(loginWrapper.find('nav').text()).toContain('arrow_back')
  // })
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
    expect(loginWrapper.find('button')).toBeTruthy()
  })

  it('should show trouble logging in section', () => {
    expect(loginWrapper.find('u').text()).toMatch('login.request_account')
    expect(loginWrapper.find('#trouble-logging-div')).toBeTruthy()
  })
})
