import React from 'react'
import Nav from '../../components/Nav'
import { useParams } from 'react-router-dom'
import { DiscussionQuery } from '../../graphql/queries'
import { useQuery } from 'react-apollo'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import Discussion from '../../components/Discussion/Discussion'

export default function DiscussonPage() {
     const { id } = useParams()
     const { loading, error, data } = useQuery(DiscussionQuery, {
         variables: { id }
     })
     if (loading) return <Loading />
     if (error ) {
         return <ErrorPage title={error.message || error} />
     }
    return (
        <div>
            <Nav navName="Discussion" menuButton="back" backTo="/discussions"/>
            <Discussion discussionData={data.discussion}/>
        </div>
    )
}