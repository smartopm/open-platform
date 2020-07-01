import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import Profile from '../components/Business/Profile'

describe('It tests the business profile page', () => {
    const props = {
        profileData: {
            category: 'construction',
            createdAt: "2020-06-30T15:54:34Z",
            homeUrl: 'https://google.com',
            name: "Artist",
            email: "a@b.com",
            phoneNumber: "23627378",
            userId: "4f1492a9-5451-4f0a-b35d-bc567e1e56b7",
            id: "43c596de-e07f-4d0f-a727-53fb4b8b44ce",
            description: 'description',
            address: 'home',
            status: 'verified'
        }
    }

    it('It should render Company name', () => {
        const container = render(
            <BrowserRouter>
                <Profile {...props} />
            </BrowserRouter>)
        expect(container.queryByTestId('details-holder').children).toHaveLength(6)
    });
    it('It should render Phone Number', () => {
        const container = render(
            <BrowserRouter>
                <Profile {...props} />
            </BrowserRouter>)
        expect(container.queryByText(/23627378/).textContent).toContain('23627378')
    });
    it('It should render Email Address', () => {
        const container = render(
            <BrowserRouter>
                <Profile {...props} />
            </BrowserRouter>)
        expect(container.queryByText(/a@b.com/).textContent).toContain('a@b.com')
    });
    it('It should render Address', () => {
        const container = render(
            <BrowserRouter>
                <Profile {...props} />
            </BrowserRouter>)
        expect(container.queryByText('home').textContent).toContain('home')
    });

    it('It should render Description', () => {
        const container = render(
            <BrowserRouter>
                <Profile {...props} />
            </BrowserRouter>)
        expect(container.queryByText('description').textContent).toContain('description')
    });

    it('It should render homeUrl', () => {
        const container = render(
            <BrowserRouter>
                <Profile {...props} />
            </BrowserRouter>)
        expect(container.queryByText('https://google.com').textContent).toContain('https://google.com')
    });

});
