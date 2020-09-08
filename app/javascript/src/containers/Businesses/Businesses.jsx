import React, {  useContext } from 'react'
import { useQuery } from 'react-apollo'
import Nav from '../../components/Nav'
import Business from '../../components/Business/BusinessList'
import Loading from '../../components/Loading'
import {BusinessesQuery} from '../../graphql/queries'
import ErrorPage from '../../components/Error'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider'


export default function Businesses() {
    const { loading, error, data, refetch } = useQuery(BusinessesQuery)
    const authState = useContext(AuthStateContext)
    if (loading) return <Loading />
    if (error) {
        return <ErrorPage title={error.message || error} /> // error could be a string sometimes
      }
   
    return (
      <div>
        <>
          <Nav navName="Business Directory" menuButton="back" backTo="/" />
          <Business businessData={data} authState={authState} refetch={refetch} />
        </>
      </div>
    )
}
