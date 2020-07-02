import React from 'react'
import Nav from '../../components/Nav'
import { useParams } from 'react-router-dom'
import { DiscussionQuery } from '../../graphql/queries'
import { useQuery } from 'react-apollo'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'

export default function DiscussonPage() {
     const { id} = useParams()
    //  const { loading, error, data } = useQuery(DiscussionQuery, {
    //      variables: {id}
    //  })

    //  if (loading) return <Loading />
    //  if (error) {
    //      return <ErrorPage title={error.message || error} />
    //  }
     console.log(id)
    return (
        <div>
            <Nav navName="Discussion" menuButton="back" backTo="/discussions"/>
        </div>
    )
}
