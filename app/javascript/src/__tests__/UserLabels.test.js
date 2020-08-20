import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import UserLabels from '../components/UserLabels'
import { UserLabelsQuery } from '../graphql/queries'
import { BrowserRouter } from 'react-router-dom'

describe('It should test the user label component', () => {

    const mockData = [
        {
            request: {
                query: UserLabelsQuery,
                variables: { userId: "59927651-9bb4-4e47-8afe-0989d03d210d" }
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
        }]


    it('It should render component', () => {

        const container = render(
            <MockedProvider mocks={mockData} addTypename={false}>
                <BrowserRouter>
                    <UserLabels userId={"59927651-9bb4-4e47-8afe-0989d03d210d"} />
                </BrowserRouter>
            </MockedProvider>
        )
        expect(container.queryByTestId("chip-label")).toBeDefined();
    })

    it('it should display the chip', async () => {
        const container = render(
            <MockedProvider mocks={mockData} addTypename={false}>
                <BrowserRouter>
                    <UserLabels userId={"59927651-9bb4-4e47-8afe-0989d03d210d"} />
                </BrowserRouter>
            </MockedProvider>
        )
        expect(container.queryByTestId("chip-label")).toBeDefined();
        await new Promise(resolve => setTimeout(resolve, 500));
        expect(container.queryByTestId('chip-label')).toBeNull()


    })

});