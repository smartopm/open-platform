import React from 'react'
import {ShareButton} from '../components/ShareButton'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('share button', () => {
    it('should always render', () => {
        
        const container = render(<ShareButton />)
        expect(container.queryByText('Share')).toBeInTheDocument()
    })

    it('should render with the proper props', () => {
        const props = {
            url: 'https://dev.dgdp.site/news '
        }
        window.open = jest.fn()
        const container = render(<ShareButton {...props} />)
        const button = container.queryByText('Share')
        expect(button).toBeTruthy()
         
    })
})