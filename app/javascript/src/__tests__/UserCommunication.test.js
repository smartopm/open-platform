import React from 'react'
import { render} from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import UserCommunication from '../components/UserCommunication'
import { UserMessageQuery } from '../graphql/queries'

describe('Mounts the UserCommunications component and loads the data', () => {

    const user = {
        user: {
            avatarUrl: 'https://via.placeholder.com/150',
            imageUrl: 'https://via.placeholder.com/150',
            name: 'Test name',
            userType: 'admin'
        }
    }
    it('It should mount the component', () => {
        const container = render(

            <BrowserRouter>
                <MockedProvider mocks={[]}>
                    <UserCommunication user={user} />
                </MockedProvider>
            </BrowserRouter>
        )
        expect(container.queryByText('Send')).toBeTruthy()
    })
})
