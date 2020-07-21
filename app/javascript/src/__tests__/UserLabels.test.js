import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import UserLabels from '../components/UserLabels'
import {UserLabelsQuery} from '../graphgl/queries'


describe('It should test the user label component', () => {

    const mockData = {
        request: {
            query: UserLabelsQuery,
            variables: {userId: "59927651-9bb4-4e47-8afe-0989d03d210d"}
        },
        result: {
            data: {
                userLabels: [
                    {
                        id: '12345678890',
                        shortDesc: "Client"
                    }
                ]
            }
        }
    } 


    it('It should render component', () => {

        const container = render(
            <MockedProvider mocks={mockData} addTypename={false}>
                <UserLabels userId={"59927651-9bb4-4e47-8afe-0989d03d210d"} />
            </MockedProvider>
        )
    })

    it('it should display the chip',()=>{
        const container = render(
            <MockedProvider mocks={mockData} addTypename={false}>
                <UserLabels userId={"59927651-9bb4-4e47-8afe-0989d03d210d"} />
            </MockedProvider>
        )
        expect(container.queryByTestId('chip-label')).toBeTruthy()
    })
    
});
