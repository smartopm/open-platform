import React from 'react';
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Text from '../../../shared/list/Text';


describe('Text component', () => {
    it('should render correctly', () => {
        const container = render(<Text content="This is typography the text to be render" />)
        expect(container.queryByText('This is typography the text to be render')).toBeInTheDocument()
    })
})

