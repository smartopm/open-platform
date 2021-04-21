import React from 'react';
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Empty from '../../shared/Empty';


describe('Empty component', () => {
    it('should render correctly', () => {
        const container = render(<Empty title="title" subtitle='subtitle' />)
        expect(container.queryByText('title')).toBeInTheDocument()
        expect(container.queryByText('subtitle')).toBeInTheDocument()
    })
})

