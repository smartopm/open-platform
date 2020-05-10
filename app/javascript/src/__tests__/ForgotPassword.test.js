import React from "react";
import {
    render
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom/extend-expect'
import NkwashiAccountManagement from '../containers/NkwashiAccountManagement'


jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('Mounts Page and tests button',()=>{

    it('Renders page and finds the',()=>{

        const {getByTestId} = render(
            <MemoryRouter>
                <NkwashiAccountManagement />
            </MemoryRouter>
        )

        expect(getByTestId('crf-link')).toBeTruthy()

    })
})