import React from 'react'
import FollowButton from '../components/Discussion/FollowButton'
import { render,} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'

describe("Follow Button for discussions",()=>{

    it('show render follow button',()=>{
        const{getByText} = render(
            <MockedProvider>
                <BrowserRouter>
                <FollowButton discussionId={12}/>
                </BrowserRouter>
            </MockedProvider>
        )
        expect(getByText('follow')).toBeInTheDocument()
    })
})