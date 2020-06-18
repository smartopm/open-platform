import React, { Fragment } from 'react'
import { wordpressEndpoint } from '../../utils/constants'
import { useFetch } from '../../utils/customHooks'
import Categories from '../../components/NewsPage/Categories'
import PostContent from '../../components/NewsPage/PostContent'

export default function NewsPage() {
    const { response, error } = useFetch(`${wordpressEndpoint}/posts/?category=news`)
    // TODO: @olivier ==> add better error page and loading component here
    if (error) {
        return error
    }
    if (!response || !response.found) {
        return 'loading'
    }
    return (
        <Fragment>
            <Categories />
            <PostContent response={response.posts[0]} />
        </Fragment>
    )
}