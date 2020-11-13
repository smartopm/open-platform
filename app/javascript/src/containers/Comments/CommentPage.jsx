import React from 'react'
import { useQuery } from 'react-apollo'
import Nav from '../../components/Nav'
import { CommentsPostQuery } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import Comments from '../../components/Comments/Comments'

export default function DiscussonPage() {
     const { loading, error, data } = useQuery(CommentsPostQuery)
     if (loading) return <Loading />
     if (error) {
        return <ErrorPage title={error.message || error} />
     }
     
    return (
      <div>
        <Nav navName="Comments" menuButton="back" backTo="/" />
        <Comments data={data.fetchComments} />
      </div>
    )
}