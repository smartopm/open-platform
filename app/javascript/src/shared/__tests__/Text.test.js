import React from 'react';
import { render } from '@testing-library/react'

import Text, { GridText, HiddenText } from "../Text";


describe('Text component', () => {
    it('should render correctly', () => {
        const container = render(<Text content="This is typography the text to be render" />)
        expect(container.queryByText('This is typography the text to be render')).toBeInTheDocument()
    })
    it('GridText should render correctly', () => {
        const container = render(<GridText content="This is typography the text to be render" />)
        expect(container.queryByText('This is typography the text to be render')).toBeInTheDocument()
    })

    it('should not show the hidden text', () => {
        const container = render(<HiddenText title="This is typography the text to be render" />)
        expect(container.queryByText('This is typography the text to be render')).toBeNull()
    })

})

