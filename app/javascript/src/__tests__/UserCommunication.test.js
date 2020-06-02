import React from 'react'
import { render, getByTestId } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import UserCommunication from '../components/UserCommunication'
import { UserMessageQuery } from '../graphql/mutations'

describe('Mounts the UserCommunications component and loads the data', () => {

    const user = {
        user :{
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
                userMessages:[
                    {
                        message: 'Heyyyy there',
                        isRead: true,
                        dateMessageCreated: '2020-04-13',
                        readAt: '2020-04-14',
                        id: '1124ff7d-0008-02b4c5a54b50',
                        user: {
                          id: 'b5ed9ea9-8b02-eb8bb4fed2c8',
                          name: 'Doez JM'
                        }
                      }

                ] 
            }
        }
    }]
    it('It should mount the component', () => {
        const { getByTestId } = render(
            
                <BrowserRouter>
                <MockedProvider mock={[mock]}>
                    <UserCommunication user={user}  />
                    </MockedProvider>
                </BrowserRouter>
            )

    })
})
