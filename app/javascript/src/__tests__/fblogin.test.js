import React from 'react'
import FBLogin from '../components/AuthScreens/FBLogin'
import { render } from '@testing-library/react'

describe('login with facebook component', () => {
  it('should have a link to facebook', () => {
    const { getByTestId } = render(<FBLogin />)
    expect(getByTestId('fblogin').textContent).toContain('Login with Facebook')
  })
})