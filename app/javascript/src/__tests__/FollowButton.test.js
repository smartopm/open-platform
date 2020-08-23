import React from 'react'
import FollowButton from '../components/Discussion/FollowButton'
import { render,} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
// import { BrowserRouter } from 'react-router-dom/'
// import { MockedProvider } from '@apollo/react-testing'

describe("Follow Button for discussions",()=>{
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

    it('show render follow button',()=>{
        const{getByText} = render(
                <FollowButton discussionId={12} email={authState.user.email}/>
        )
        expect(getByText('follow')).toBeInTheDocument()
    })
})