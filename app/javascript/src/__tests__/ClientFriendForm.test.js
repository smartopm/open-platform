import React from 'react'
import {
    render
} from '@testing-library/react'
import ClientRequestForm from '../containers/ClientRequestForm'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom/extend-expect'


jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('Mounts page with no errors',()=>{

    let wrapper
    it('it should render',()=>{

        const {getByTestId} = render(
            <MemoryRouter>
                <ClientRequestForm />
            </MemoryRouter>

        )

        expect(getByTestId('iframe')).toBeTruthy()
    })
})