import React, { Fragment } from 'react'
import { wordpressEndpoint } from '../../utils/constants'
import { useFetch } from '../../utils/customHooks'
import Categories from '../../components/NewsPage/Categories'
import PostContent from '../../components/NewsPage/PostContent'
import {ShareButton} from '../../components/ShareButton'
import Nav from '../../components/Nav'
import Loading from '../../components/Loading'
import CenteredContent from '../../components/CenteredContent'

export default function NewsPage() {
    const { response, error } = useFetch(`${wordpressEndpoint}/posts/?category=news`)
    const location = window.location.href
    // TODO: @olivier ==> add better error page and loading component here
    if (error) {
        return error
    }
    if (!response || !response.found) {
        return <CenteredContent> <Loading /> </CenteredContent> 
    }
    return (
        <Fragment >
            <Nav navName="News" menuButton="back" backTo="/" />
            <Categories />
            <PostContent response={response.posts[0]} />
            <ShareButton url={location}/>
        </Fragment>
    )
}