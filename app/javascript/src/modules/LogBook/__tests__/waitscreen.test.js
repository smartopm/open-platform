import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import {
  GrantedScreen,
  DeniedScreen,
} from '../Components/WaitingScreen'
import '@testing-library/jest-dom/extend-expect'
import { Context } from '../../../containers/Provider/AuthStateProvider'
import userMock from '../../../__mocks__/userMock'

// const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
describe('wait screen component', () => {
  //
  it('renders granted screen with correct details', () => {
    const { getByText } = render(
      <BrowserRouter>
        <GrantedScreen />
      </BrowserRouter>
    )
    expect(getByText('Granted')).toBeInTheDocument()
    expect(getByText('Home')).toBeInTheDocument()
    expect(getByText('Home')).not.toBeDisabled()
  })

  it('renders denied screen with correct details', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Context.Provider value={userMock}>
          <DeniedScreen />
        </Context.Provider>
      </BrowserRouter>
    )
    expect(getByText('Denied')).toBeInTheDocument()
    expect(getByText('Call Manager')).toBeInTheDocument()
    expect(getByText('Home')).toBeInTheDocument()
  })
})
