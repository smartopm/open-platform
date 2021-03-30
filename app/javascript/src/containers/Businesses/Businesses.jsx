import React, { useContext } from 'react'
import { useQuery } from 'react-apollo'
import Business from '../../components/Business/BusinessList'
import Loading from '../../shared/Loading'
import { BusinessesQuery } from '../../graphql/queries'
import ErrorPage from '../../components/Error'
import { Context } from '../Provider/AuthStateProvider'

export default function Businesses() {
    const { loading, error, data, refetch } = useQuery(BusinessesQuery)
    const authState = useContext(Context)

    if (loading) return <Loading />
    if (error) {
        return <ErrorPage title={error.message || error} /> // error could be a string sometimes
      }
   
    return (
      <>
        <Business businessData={data} refetch={refetch} userType={authState.user.userType} />
      </>
    )
}
