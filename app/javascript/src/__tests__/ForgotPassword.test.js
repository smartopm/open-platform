/* eslint-disable */
import React from "react";
import {
    render
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'

import NkwashiAccountManagement from '../containers/NkwashiAccountManagement'

describe('Mounts Page and tests button',()=>{
    it('Renders page and finds the',  ()=>{
        render(
            <MockedProvider mocks={[]}>
                <MemoryRouter>
                    <NkwashiAccountManagement />
                </MemoryRouter>
            </MockedProvider>
        )
    })
})