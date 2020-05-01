import React from 'react'
import {
    cleanup,
    fireEvent,
    render,
    queryByAttribute 
} from '@testing-library/react'
import SocialMediaLinks from '../components/SocialMediaLinks'


describe('tests the social media links and the new window opennings', ()=>{

const facebookUrl = 'https://www.facebook.com/nkwashi.soar/'
const twitterUrl = 'https://twitter.com/Nkwashi_'
const websiteUrl = 'http://nkwashi.com/'
const blank = '_blank'
    
    it('it renders without error',()=>{
        const getById = queryByAttribute.bind(null, 'id');
        const dom = render(<SocialMediaLinks />)
        expect(getById(dom.container, 'div')).toBeTruthy()
    })

    it('renders icons and opens new window with url',()=>{

        window.open = jest.fn();
        const getById = queryByAttribute.bind(null, 'id');
        const dom = render(<SocialMediaLinks />)
        const btnFacebook =  getById(dom.container, 'facebook')
        const btnTwitter = getById(dom.container, 'twitter')
        const btnWebsite = getById(dom.container, 'website')
        fireEvent.click(btnFacebook)
        expect(window.open).toBeCalledWith(facebookUrl,blank)
        fireEvent.click(btnTwitter)
        expect(window.open).toBeCalledWith(twitterUrl,blank)
        fireEvent.click(btnWebsite)
        expect(window.open).toBeCalledWith(websiteUrl,blank)
        
    })

    afterEach(cleanup)
})