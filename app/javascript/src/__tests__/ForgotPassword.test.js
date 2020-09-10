/* eslint-disable */
import React from "react";
import {
    render
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import '@testing-library/jest-dom/extend-expect'
import NkwashiAccountManagement from '../containers/NkwashiAccountManagement'


jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('Mounts Page and tests button',()=>{

    it('Renders page and finds the',  ()=>{

        const { getByTestId } = render(
            <MockedProvider mocks={[]}>
                <MemoryRouter>
                    <NkwashiAccountManagement />
                </MemoryRouter>
            </MockedProvider>
        )
        const button = getByTestId('reset_password')
        expect(button).toBeTruthy()
    
    })
})