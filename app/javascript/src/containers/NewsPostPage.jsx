import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { wordpressEndpoint } from '../utils/constants'
import { useFetch } from '../utils/customHooks'
import Categories from '../components/NewsPage/Categories'
import PostContent from '../components/NewsPage/PostContent'

export default function NewsPostPage() {
    const { id } = useParams()
    const { response, error } = useFetch(`${wordpressEndpoint}/posts/${id}`)
    // TODO: @olivier ==> add better error page and loading component here
    if (error) {
        return error
    }
    if (!response) {
        return 'loading'
    }
    return (
        <Fragment>
            <Categories />
            <PostContent response={response} />
        </Fragment>
    )
}