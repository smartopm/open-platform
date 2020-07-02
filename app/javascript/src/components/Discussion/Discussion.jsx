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
    
    return (
        <div className="container">
            <Fragment>
                <Typography variant="h6">{discussionData.title}</Typography>
                <Typography variant="body1">
                   {discussionData.description || 'No Description'}
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




