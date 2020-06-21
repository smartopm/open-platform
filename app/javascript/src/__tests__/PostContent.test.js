import React from 'react'
import {render} from '@testing-library/react'
import PostContent from '../components/NewsPage/PostContent';

describe('Details page for news post content', () => {

    const response = {

        title: 'Test title',
        content: '<p>This is test component for the news page</p>',
        post_thumbnail: {
            URL: 'https://placeholder.com'
        }
    }
    it('it should render ', () => {
        const container = render(<PostContent response={response} />)
        expect(container.queryByText("Test title")).toBeTruthy()
        expect(container.queryByText('This is test component for the news page')).toBeTruthy()
    });
    
});
