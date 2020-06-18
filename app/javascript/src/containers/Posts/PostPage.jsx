import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { wordpressEndpoint } from '../../utils/constants'
import { useFetch } from '../../utils/customHooks'
import Categories from '../../components/NewsPage/Categories'
import PostContent from '../../components/NewsPage/PostContent'
import {ShareButton} from '../../components/ShareButton'
import Nav from '../../components/Nav'

export default function PostPage() {
    const { id } = useParams()
    const currentUrl = window.location.href
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
            <Nav navName="News" menuButton="back" backTo="/spike_news/posts" />
            <Categories />
            <PostContent response={response} />
            <ShareButton url={currentUrl} />
        </Fragment>
    )
}