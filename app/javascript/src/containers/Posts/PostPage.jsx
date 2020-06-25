import React, { Fragment, useContext } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { wordpressEndpoint } from '../../utils/constants'
import { useFetch } from '../../utils/customHooks'
import PostContent from '../../components/NewsPage/PostContent'
import {ShareButton} from '../../components/ShareButton'
import Nav from '../../components/Nav'
import { Context as AuthStateContext } from "../../containers/Provider/AuthStateProvider";

export default function PostPage() {
    const { id } = useParams()
    const authState = useContext(AuthStateContext);
    const currentUrl = window.location.href
    const { response, error } = useFetch(`${wordpressEndpoint}/posts/${id}`)
    // TODO: @olivier ==> add better error page and loading component here
    if (error) {
        return error
    }
    if (!response) {
        return 'loading'
    }
    if (response.categories?.Private && !authState.loggedIn) {
        return <Redirect to="/welcome" />
    }
    
    return (
        <Fragment>
            <Nav menuButton="back" backTo={authState.loggedIn ? '/nkwashi_news/posts' : '/welcome'} />
            <PostContent response={response} />
            <ShareButton url={currentUrl} />
        </Fragment>
    )
}