import React from 'react'
import { render } from '@testing-library/react'
import PostContent from '../components/NewsPage/PostContent';
import '@testing-library/jest-dom/extend-expect'

// Don't use truthy matchers, as something like this {} can misled test results
describe('Details page for news post content', () => {
    const response = {
        title: 'Test title',
        content: '<p>This is test component for the news page</p>',
        post_thumbnail: {
            URL: 'https://placeholder.com'
        }
    }

    it('it should include the post title ', () => {
        const container = render(<PostContent response={response} />)
        expect(container.queryByText("Test title")).toBeInTheDocument()
    });
    
    it('it should include the post content ', () => {
        const container = render(<PostContent response={response} />)
        expect(container.queryByText("This is test component for the news page")).toBeInTheDocument()
    });

    
});
