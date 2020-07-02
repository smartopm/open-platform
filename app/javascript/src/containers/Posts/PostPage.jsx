import React, { Fragment, useContext } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import { Button } from '@material-ui/core'
import { wordpressEndpoint } from '../../utils/constants'
import { useFetch, useWindowDimensions } from '../../utils/customHooks'
import { ShareButton } from '../../components/ShareButton'
import Nav from '../../components/Nav'
import { Context as AuthStateContext } from "../../containers/Provider/AuthStateProvider";
import { Spinner } from '../../components/Loading'
import IframeContainer from '../../components/IframeContainer'
import { PostDiscussionQuery, PostCommentsQuery } from '../../graphql/queries'
import Comments from '../../components/Discussion/Comment'
import { DiscussionMutation } from '../../graphql/mutations'

export default function PostPage() {
    const { id } = useParams()
    const authState = useContext(AuthStateContext);
    const currentUrl = window.location.href
    const { width, height } = useWindowDimensions()
    const { response } = useFetch(`${wordpressEndpoint}/posts/${id}`)

    const queryResponse = useQuery(PostDiscussionQuery, {
        variables: { postId: id }
    })
    const { loading, data, refetch } = useQuery(PostCommentsQuery, {
        variables: { postId: id }
    })
    const [discuss] = useMutation(DiscussionMutation)

    function createDiscussion(title, id) {
        discuss({
            variables: { postId: id.toString(), title }
        })
        .then(() => queryResponse.refetch())
        .catch(err => console.log(err.message))
    }

    if (!response || queryResponse.loading || loading) {
        return <Spinner />
    }
    // instead of redirecting, ask them to log in
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
            {
                queryResponse.data.postDiscussion ? (
                    <Comments
                        comments={data.postComments}
                        refetch={refetch}
                        discussionId={queryResponse.data.postDiscussion.id}
                    />
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