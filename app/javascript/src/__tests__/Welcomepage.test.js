import React from 'react'
import WelcomePage from '../components/AuthScreens/WelcomePage'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MemoryRouter } from 'react-router'

describe('component that centers divs', () => {
    const Welcome = () => <MemoryRouter><WelcomePage /></MemoryRouter>

    it('should include proper text', () => {
        const container = render(<Welcome />)
        expect(container.queryByText('Here i am')).toBeNull()
        expect(container.queryByText('Here i am')).not.toBeInTheDocument()
    })
    it('should have action button texts', () => {
        const container = render(<Welcome />)
        expect(container.queryByText('Schedule a call')).toBeInTheDocument()
        expect(container.queryByText('Book a tour')).toBeInTheDocument()
        expect(container.queryByText('Become a client')).toBeInTheDocument()
    })

    it('should have main centered text', () => {
        const container = render(<Welcome />)
        expect(container.queryByTestId('maintext-centered').textContent).toContain('Its not just a house')
    })
    it('should have location text', () => {
        const container = render(<Welcome />)
        expect(container.queryByTestId('locationtext').textContent).toContain('11 Nalikwanda Road')
    })
    it('should have main text', () => {
        const container = render(<Welcome />)
        expect(container.queryByTestId('maintext').textContent).toContain('among the best architectural firms on the African')
    })
    it('should have 3 main buttons', () => {
        const container = render(<Welcome />)
        expect(container.container.getElementsByTagName('button')).toHaveLength(6)
    })
    it('should have an image with a proper url', () => {
        const container = render(<Welcome />)
        expect(container.container.getElementsByTagName('img')[1]).toHaveAttribute('src', 'https://nkwashi.com/wp-content/uploads/2017/02/home-hero.jpg')
    })
    it('The first image should have a proper alternative text ', () => { // we could get the path but don't have to
        const container = render(<Welcome />)
        expect(container.container.getElementsByTagName('img')[0]).toHaveAttribute('alt', 'Nkwashi logo with title')
    })
    it('should have a main nkwashi logo ', () => {
        const container = render(<Welcome />)
        expect(container.queryByTestId('nkwashi_logo')).toHaveAttribute('alt', 'community logo')
    })
    it('should have a footer thebe logo ', () => {
        const container = render(<Welcome />)
        expect(container.queryByTestId('thebe_logo')).toHaveAttribute('alt', 'thebe logo')
    })
    it('should have copyright text ', () => {
        const container = render(<Welcome />)
        expect(container.queryByTestId('copyright_text').textContent).toContain('©2017. Thebe Investment Management Limited. All Rights Reserved')
    })
    it('should have social links ', () => {
        const container = render(<Welcome />)
        expect(container.queryByTestId('ld_follow')).toHaveAttribute('href', 'https://www.linkedin.com/company/10478892')
        expect(container.queryByTestId('fb_like')).toHaveAttribute('href', 'https://www.facebook.com/nkwashi.soar/')
    })
})