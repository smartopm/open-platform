import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import UserLabels from '../components/UserLabels'
describe('It should test the user label component', () => {

    const data = {
        userLables: [
            {
                id: '1234456',
                shortDesc: "Client"
            }
        ]
    }
    it('It should render component', () => {

        const container = render(
            <MockedProvider mock={data}>
                <UserLabels userId={"1234567"} />
            </MockedProvider>
        )
    })

    it('it should display the chip', () => {

        const container = render(
            <MockedProvider>
                <UserLabels userId={"1234567"} />
            </MockedProvider>
        )

        expect(container.queryByTestId('chip-label')).toBeTruthy()
    })

});
