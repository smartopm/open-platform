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

    const mock = [{
        request: {
            query: UserMessageQuery,
            variable: { id: '4f1492a9-5451-4f0a-b35d-bc567e1e56b7' }
        },
        result: {
            data: {
                userMessages: [
                    {
                        id: "9d8a7a58-8581-435e-9244-3bf44075e1be",
                        userId: "4f1492a9-5451-4f0a-b35d-bc567e1e56b7"
                    }
                ]
            }
        }
    }]
    it('It should mount the component', () => {
        const container = render(

            <BrowserRouter>
                <MockedProvider mocks={mock}>
                    <UserCommunication user={user} />
                </MockedProvider>
            </BrowserRouter>
        )
        expect(container.queryByText('Send')).toBeTruthy()
    })
})
