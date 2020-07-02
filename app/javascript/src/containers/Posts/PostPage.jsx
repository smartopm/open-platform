import React, { Fragment, useContext } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { wordpressEndpoint } from '../../utils/constants'
import { useFetch, useWindowDimensions } from '../../utils/customHooks'
import {ShareButton} from '../../components/ShareButton'
import Nav from '../../components/Nav'
import { Context as AuthStateContext } from "../../containers/Provider/AuthStateProvider";
import { Spinner } from '../../components/Loading'
import IframeContainer from '../../components/IframeContainer'
import { useQuery, useMutation } from 'react-apollo'
import { DiscussionQuery } from '../../graphql/queries'
import Comments from '../../components/Discussion/Comment'
import { Button } from '@material-ui/core'
import { DiscussionMutation } from '../../graphql/mutations'

export default function PostPage() {
    const { id } = useParams()
    const authState = useContext(AuthStateContext);
    const currentUrl = window.location.href
    const {width, height} = useWindowDimensions()
    const { response, error } = useFetch(`${wordpressEndpoint}/posts/${id}`)
    const { data, loading } = useQuery(DiscussionQuery, {
        variables: { postId: id}
    })
    const [discuss] = useMutation(DiscussionMutation)

    function createDiscussion(title, id) {
        discuss({ variables: { postId: id, title } })
            .then(() => { })
            .catch(err => console.log(err.message))
    }
    if (error) {
        return error.message
    }
    if (!response) {
        return <Spinner />
    }
    if (response.categories?.Private && !authState.loggedIn) {
        return <Redirect to="/welcome" />
    }
    console.log(response)
    return (
        <Fragment>
            <Nav menuButton="back" backTo={authState.loggedIn ? '/nkwashi_news' : '/welcome'} />
            <div className="post_page">
                <IframeContainer link={response?.URL || ""} width={width} height={height} />
                <ShareButton url={currentUrl} />
            </div>
            {
                !loading && data.discussionPost ? (
                    <Comments />
                )
                    : (
                        <Button variant="outlined" onClick={() => createDiscussion(response?.title, response?.ID)}>
                            Create Discussion
                        </Button>
                )
            }
        </Fragment>
    )
}