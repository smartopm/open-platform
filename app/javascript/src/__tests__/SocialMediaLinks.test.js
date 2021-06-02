/* eslint-disable */
import React from 'react'
import {
    cleanup,
    fireEvent,
    render,
    queryByAttribute 
} from '@testing-library/react'
import SocialMediaLinks from '../components/SocialMediaLinks'


describe('tests the social media links and the new window openings', ()=>{
    const blank = '_blank'
    const data = [
        {social_link: 'https://www.facebook.com/nkwashi.soar/', category: 'facebook'},
        {social_link: 'https://twitter.com/Nkwashi_', category: 'twitter'},
        {social_link: 'http://nkwashi.com/', category: 'website'},
    ]
    
    it('it renders without error',()=>{
        const getById = queryByAttribute.bind(null, 'id');
        const dom = render(<SocialMediaLinks  data={data} communityName='Nkwashi'/>)
        expect(getById(dom.container, 'div')).toBeTruthy()
        expect(dom.queryByText(/Nkwashi/i)).toBeTruthy()
    })

    it('it hides when social links are undefined', () => {
        const getById = queryByAttribute.bind(null, 'id');
        const dom = render(<SocialMediaLinks data={undefined} communityName='Nkwashi' />)
        expect(getById(dom.container, 'div')).toBeNull()
    });

    it('renders icons and opens new window with url',()=>{

        window.open = jest.fn();
        const getById = queryByAttribute.bind(null, 'id');
        const dom = render(<SocialMediaLinks data={data} communityName='Nkwashi'/>)
        const btnFacebook =  getById(dom.container, 'facebook')
        const btnTwitter = getById(dom.container, 'twitter')
        const btnWebsite = getById(dom.container, 'website')
        fireEvent.click(btnFacebook)
        expect(window.open).toBeCalledWith(data[0]['social_link'],blank)
        fireEvent.click(btnTwitter)
        expect(window.open).toBeCalledWith(data[1]['social_link'],blank)
        fireEvent.click(btnWebsite)
        expect(window.open).toBeCalledWith(data[2]['social_link'],blank)  
    });

    afterEach(cleanup)
})