import React, { Fragment } from 'react'
import Nav from '../../components/Nav'
import Profile from '../../components/Business/Profile'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import { BusinessByIdQuery } from '../../graphql/queries'
import Loading from '../../components/Loading'

export default function BusinessProfile() {
    const { id } = useParams()
    const { loading, error, data } = useQuery(BusinessByIdQuery, {
        variables: { id }
    })
    if (loading) return <Loading />
    return (
        <div>
            <Fragment>
                <Nav navName="Business Profile" menuButton="back" backTo="/business" />
                <Profile profileData={data.business} />
            </Fragment>


        </div>
    )
}
