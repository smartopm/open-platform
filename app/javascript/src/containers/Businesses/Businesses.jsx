import React, { Fragment } from 'react'
import Nav from '../../components/Nav'
import Business from '../../components/Business/Business'
import Loading from '../../components/Loading'
import { useQuery } from 'react-apollo'
import {BusinessesQuery} from '../../graphql/queries'
import ErrorPage from '../../components/Error'


export default function Businesses() {
    const { loading, error, data } = useQuery(BusinessesQuery)
    if (loading) return <Loading />
    if (error) {
        return <ErrorPage title={error.message || error} /> // error could be a string sometimes
      }
    console.log(data)
    return (
        <div>
            <Fragment>
                <Nav navName="Business Directory" menuButton="back" backTo="/" />
                <Business businessData={data} />
            </Fragment>
        </div>
    )
}
