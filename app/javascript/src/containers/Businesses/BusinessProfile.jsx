import React, { Fragment } from 'react'
import Nav from '../../components/Nav'
import Profile from '../../components/Business/BusinessProfile'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import { BusinessByIdQuery } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'

export default function BusinessProfile() {
    const { id } = useParams()
    const { loading, error, data } = useQuery(BusinessByIdQuery, {
        variables: { id }
    })
    if (loading) return <Loading />
    if (error) {
        return <ErrorPage title={error.message || error} /> // error could be a string sometimes
      }
    return (
        <div>
            <Fragment>
                <Nav navName="Business Profile" menuButton="back" backTo="/business" />
                <Profile profileData={data.business} />
            </Fragment>


        </div>
    )
}
