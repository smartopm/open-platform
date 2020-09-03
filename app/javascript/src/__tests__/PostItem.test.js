/* eslint-disable */
import React from 'react'
import { render } from '@testing-library/react'
import PostItem from '../components/NewsPage/PostItem';
import '@testing-library/jest-dom/extend-expect'

describe('Details page for news post content', () => {
    const props = {
        title: 'Test title',
        imageUrl: 'htpps://exampleimage.com/urld',
        datePosted: '',
        subTitle: 'I am a subtitle without a title',
    }
    it('it should  have a title ', () => {
        const container = render(<PostItem { ...props} />)
        expect(container.queryByText(props.title)).toBeInTheDocument()
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
