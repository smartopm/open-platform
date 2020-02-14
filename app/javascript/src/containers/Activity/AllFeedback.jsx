import React, { Fragment, useState } from 'react'
import Nav from '../../components/Nav'
import { useQuery } from 'react-apollo'
import { allFeedback } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import DateUtil from '../../utils/dateutil.js'
import { formatISO9075 } from 'date-fns'

export default function FeedbackPage() {
    const { loading, error, data,  } = useQuery(allFeedback)

    if (loading) return <Loading />
    if (error) return <ErrorPage error={error.message} />
    console.log(data)

    return (
        <Fragment>
            <Nav navName='Notes' menuButton='back' /> 
                Feedback Page
        </Fragment>
    )
}