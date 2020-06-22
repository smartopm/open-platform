import React from 'react'
import WelcomePage from '../components/AuthScreens/WelcomePage'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MemoryRouter } from 'react-router'

describe('component that centers divs', () => {
    it('should include proper text', () => {
        const container = render(
        <MemoryRouter>
            <WelcomePage />
        </MemoryRouter>
        )
        expect(container.queryByText('Here i am')).toBeNull()
        expect(container.queryByText('Here i am')).not.toBeInTheDocument()
    })
    it('should have action button texts', () => {
        const container = render(
        <MemoryRouter>
            <WelcomePage />
        </MemoryRouter>
        )
        expect(container.queryByText('Schedule a call')).toBeInTheDocument()
        expect(container.queryByText('Book a tour')).toBeInTheDocument()
        expect(container.queryByText('Become a client')).toBeInTheDocument()
    })
    
    it('should have main centered text', () => {
        const container = render(
        <MemoryRouter>
            <WelcomePage />
        </MemoryRouter>
        )
        expect(container.queryByTestId('maintext-centered').textContent).toContain('Its not just a house')
    })
    it('should have location text', () => {
        const container = render(
        <MemoryRouter>
            <WelcomePage />
        </MemoryRouter>
        )
        expect(container.queryByTestId('locationtext').textContent).toContain('11 Nalikwanda Road')
    })
    it('should have main text', () => {
        const container = render(
        <MemoryRouter>
            <WelcomePage />
        </MemoryRouter>
        )
        expect(container.queryByTestId('maintext').textContent).toContain('among the best architectural firms on the African')
    })
    it('should have 3 main buttons', () => {
        const container = render(
        <MemoryRouter>
            <WelcomePage />
        </MemoryRouter>
        )
        expect(container.container.getElementsByTagName('button')).toHaveLength(4) // plus the getting started
    })
    it('should have an image with a proper url', () => {
        const container = render(
        <MemoryRouter>
            <WelcomePage />
        </MemoryRouter>
        )
        expect(container.container.getElementsByTagName('img')[0]).toHaveAttribute('src', 'https://nkwashi.com/wp-content/uploads/2017/02/home-hero.jpg')
    })
})
