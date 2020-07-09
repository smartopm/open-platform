import React from 'react'
import UserLog from '../components/UserLog'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'

describe('User infromation component loads', () => {
  const data = {
 
      result: [{
          id: "1",
          createdAt: "2020-06-18T13:47:42Z",
          sentence : "I am testing this again"
      }]
  }

  it('should render user name on contacts tab', () => {
    const { getByText } = render(
      <MockedProvider mock={[]}>
        <BrowserRouter>
          <UserLog data={data} />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(getByText('I am testing this again')).toBeInTheDocument()
  })
})
