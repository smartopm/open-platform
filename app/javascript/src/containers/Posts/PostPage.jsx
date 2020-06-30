import React, { Fragment, useContext } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { wordpressEndpoint } from '../../utils/constants'
import { useFetch, useWindowDimensions } from '../../utils/customHooks'
import {ShareButton} from '../../components/ShareButton'
import Nav from '../../components/Nav'
import { Context as AuthStateContext } from "../../containers/Provider/AuthStateProvider";
import { Spinner } from '../../components/Loading'
import IframeContainer from '../../components/IframeContainer'

export default function PostPage() {
    const { id } = useParams()
    const authState = useContext(AuthStateContext);
    const currentUrl = window.location.href
    const {width, height} = useWindowDimensions()
    const { response, error } = useFetch(`${wordpressEndpoint}/posts/${id}`)
    if (error) {
        return error.message
    }
    if (!response) {
        return <Spinner />
    }
    if (response.categories?.Private && !authState.loggedIn) {
        return <Redirect to="/welcome" />
    }
    return (
        <Fragment>
            <Nav menuButton="back" backTo={authState.loggedIn ? '/nkwashi_news' : '/welcome'} />
            <div className="post_page">
                <IframeContainer link={response?.URL || ""} width={width} height={height} />
                <ShareButton url={currentUrl} />
            </div>
        </Fragment>
    )
}