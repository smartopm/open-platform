import React, { Fragment } from 'react'
import Nav from '../../components/Nav'
import Business from '../../components/Business/Business'
import Loading from '../../components/Loading'
import { useQuery } from 'react-apollo'
import {BusinessesQuery} from '../../graphql/queries'



export default function Businesses() {
    const { loading, error, data } = useQuery(BusinessesQuery)

    if (loading) return <Loading />
    return (
        <div>
            <Fragment>
                <Nav navName="Business" menuButton="back" backTo="/" />
                <Business businessData={data} />
            </Fragment>
        </div>
    )
}
