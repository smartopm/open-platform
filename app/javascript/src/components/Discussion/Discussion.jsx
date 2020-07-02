import React, { Fragment } from 'react';
import { Divider, Typography } from '@material-ui/core';
import Comment from './Comment';
import { DiscussionCommentsQuery } from '../../graphql/queries'
import { useQuery } from 'react-apollo'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'

export default function Discussion({ discussionData }) {
    const { id } = discussionData
    const { loading, error, data, refetch } = useQuery(DiscussionCommentsQuery, {
        variables: { id }
    })
    if (loading) return <Loading />
    if (error) {
        return <ErrorPage title={error.message || error} />
    }
    console.log(id)
    return (
        <div className="container">
            <Fragment>
                <Typography variant="h6">{discussionData.title}</Typography>
                <Typography variant="body1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                </Typography>
                <br />
                <Typography variant="body2">
                    <strong>{discussionData.user.name}</strong>
                </Typography>
                <Typography variant="caption">
                    {discussionData.createdAt}
                </Typography>
                <Divider />
                <br />
                <Typography variant='subtitle1'>
                        Comments
                    </Typography>
                <br />
                
                <Comment comments={data.discussComments} discussionId={id} refetch={refetch} />
            </Fragment>
        </div>
    );
};




