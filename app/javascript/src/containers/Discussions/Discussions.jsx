import React, { Fragment } from 'react'
import Nav from '../../components/Nav'
import DiscussionList from '../../components/Discussion/DiscussionList'
import { DiscussionsQuery } from '../../graphql/queries'
import { useQuery } from 'react-apollo'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'

export default function Discussions() {
    const { loading, error, data } = useQuery(DiscussionsQuery)

    if (loading) return <Loading />
    if (error) {
        return <ErrorPage title={error.message || error} />
    }
    console.log(data)
    return (

        <div>
            <Fragment>
                <Nav navName="Discussion Topics" menuButton="back" backTo="/" />
                <DiscussionList data={data.discussions} />
            </Fragment>

        </div>
    )
}
