import React, { Fragment } from 'react'
import { Helmet } from "react-helmet";
import { wordpressEndpoint } from '../../utils/constants'
import { useFetch } from '../../utils/customHooks'
import Categories from '../../components/NewsPage/Categories'
import PostContent from '../../components/NewsPage/PostContent'
import { ShareButton } from '../../components/ShareButton'
import Nav from '../../components/Nav'
import { Spinner } from '../../components/Loading'
import { removeHtmlTagsFromStrings } from '../../utils/helpers'

export default function NewsPage() {
    const { response, error } = useFetch(`${wordpressEndpoint}/posts/?category=news`)
    const location = window.location.href
    if (error) {
        return error.message
    }
    if (!response || !response.found) {
        return <Spinner />
    }
    return (
        <Fragment >
            <Helmet>
                <meta property="og:title" content={response.posts[0].title} />
                <meta property="og:image" content={response.posts[0].featured_image } />
                <meta property="og:description" content={removeHtmlTagsFromStrings(response.posts[0].excerpt)} />
            </Helmet>
            <Nav navName="News" menuButton="back" backTo="/" />
            <Categories />
            <PostContent response={response.posts[0]} />
            <ShareButton url={location} />
        </Fragment>
    )
}