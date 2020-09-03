/* eslint-disable */
import React from 'react'
import {
    render
} from '@testing-library/react'
import ClientRequestForm from '../containers/ClientRequestForm'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import '@testing-library/jest-dom/extend-expect'


jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('Mounts page with no errors',()=>{

    
    it('it should render',()=>{
        const { getByTestId } = render(
            <MockedProvider mocks={[]}>
                <MemoryRouter>
                    <ClientRequestForm />
                </MemoryRouter>
            </MockedProvider>
        )
        expect(getByTestId('iframe')).toBeTruthy()
    })
})