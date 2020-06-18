import React from 'react'
import {ShareButton} from '../components/ShareButton'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('share button', () => {
    it('should always render', () => {
        
        const container = render(<ShareButton />)
        expect(container.queryByText('Share on Facebook')).toBeInTheDocument()
    })

    it('should render with the proper props', () => {
        const props = {
            url: 'https://dev.dgdp.site/news '
        }
        window.open = jest.fn()
        const container = render(<ShareButton {...props} />)
        const button = container.queryByText('Share on Facebook')
        fireEvent.click(button)
        expect(window.open).toBeCalledWith(
            "https://www.facebook.com/sharer/sharer.php?u=https%3A//dev.dgdp.site/news%20&t=", "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600"
        )
        expect(window.open).toBeCalledTimes(1)
    })
})
