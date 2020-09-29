/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { render } from '@testing-library/react'
import PostItem from '../components/NewsPage/PostItem';
import '@testing-library/jest-dom/extend-expect'

describe('Details page for news post content', () => {
    const props = {
        title: 'Test title said &quot;with html entities&quot; and a few &cent;',
        imageUrl: 'htpps://exampleimage.com/urld',
        datePosted: '',
        subTitle: 'I am a subtitle without a title',
    }
    it('it should  have a title ', () => {
        const container = render(<PostItem {...props} />)
        expect(container.queryByTestId("post_title").textContent).toContain("Test title said")
        // it should properly remove the html entities
        expect(container.queryByTestId("post_title")).toHaveTextContent('Test title said "with html entities" and a few ¢')
    });

    it('it should  have a subtitle ', () => {
        const container = render(<PostItem {...props} />)
        expect(container.queryByText(props.subTitle)).toBeInTheDocument()
    });
    it('it should  have a read more text ', () => {
        const container = render(<PostItem {...props} />)
        expect(container.queryByText('Read More')).toBeInTheDocument()
    });
});
