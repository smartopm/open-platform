import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import UserLabels from '../components/UserLabels'
describe('It should test the user label component', () => {

    it('It should render component',()=>{

        const container = render(
            <MockedProvider>
                <UserLabels userId={"1234567"} />
            </MockedProvider>
        )
    })

    it('',()=>{

        const container = render(
            <MockedProvider>
                <UserLabels userId={"1234567"} />
            </MockedProvider>
        )
        expect(container.queryByTestId('chip-label')).toBeTruthy()
    })
    
});
