import React from 'react'
import {render} from '@testing-library/react'
import PostiItem from '../components/NewsPage/PostiItem';

describe('Testing the posts Card', () => {

    const data = {
        title: "Test title", 
        imageUrl: "https://placeholder.com", 
        datePosted: "2020-06-18T07:18:21-07:00", 
        subTitle: "Test content for the Nkwashi news" 
    }

    it('it should always render', ()=>{

        const container = render( <PostiItem {...data} />)
        expect(container.queryByText('Test title')).toBeTruthy()
        expect(container.queryByText('Test content for the Nkwashi news')).toBeTruthy()

    })
    
});
