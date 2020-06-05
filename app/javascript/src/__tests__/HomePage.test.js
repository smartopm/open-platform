import React from 'react'
import Homepage from '../components/HomePage'
import { render,} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'

describe("Home",()=>{
    const authState = {
        loaded: true,
        loggedIn: true,
        setToken: jest.fn(),
        user: {
          avatarUrl: null,
          community: { name: 'Nkwashi' },
          email: '9753942',
          expiresAt: null,
          id: '11cdad78',
          imageUrl: null,
          name: 'John Doctor',
          phoneNumber: '260971500748',
          userType: 'security_guard'
        }
      }
    it('should render without error',()=>{

        render(
            <MockedProvider >
              <BrowserRouter>
                <Homepage authState={authState}/>
            </BrowserRouter>
            </MockedProvider>
        )
    })
})