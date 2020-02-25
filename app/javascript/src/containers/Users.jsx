import React, { Fragment } from 'react'
import { useQuery } from 'react-apollo'
import Nav from '../components/Nav'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'
import { UsersQuery } from '../graphql/queries'
import DateUtil from '../utils/dateutil.js'


export default function UsersList() {
    const { loading, error, data } = useQuery(UsersQuery)
    if (loading) return <Loading />
    if (error) return <ErrorPage error={error.message} />
    return (
        <Fragment>
            <Nav navName='Users' menuButton='back' />

            <div className="container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Expires At</th>
                            <th>User Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{DateUtil.formatDate(user.expiresAt)}</td>
                                    <td>{user.userType}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </Fragment>
    )
}

