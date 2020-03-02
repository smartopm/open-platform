import React from 'react'
import Nav from '../../components/Nav'
import { useQuery } from 'react-apollo'
import { ShowroomEntriesQuery } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import DateUtil from '../../utils/dateutil'


export default function ShowroomLogs() {

    const { loading, error, data } = useQuery(ShowroomEntriesQuery)

    if (loading) return <Loading />
    if (error) return <ErrorPage error={error.message} />
    return (
        <div>
            <div
                style={{
                    backgroundColor: "#25c0b0"
                }}
            >
                <Nav menuButton="back" navName="Showroom Logs" boxShadow={"none"} />
            </div>
            <div className="row justify-content-center">
                <div className="col-10 col-sm-10 col-md-6 table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Phone Number</th>
                                <th scope="col">Email</th>
                                <th scope="col">NRC</th>
                                <th scope="col">Home Address</th>
                                <th scope="col">Reason</th>
                                <th scope="col">Date</th>
                                <th scope="col">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.showroomEntries.map((entry) => (
                                    <tr key={entry.id}>
                                        <td>{entry.name}</td>
                                        <td>{entry.phoneNumber}</td>
                                        <td>{entry.email}</td>
                                        <td>{entry.nrc}</td>
                                        <td>{entry.homeAddress}</td>
                                        <td>{entry.reason}</td>
                                        <td>{DateUtil.dateToString(new Date(entry.createdAt))}</td>
                                        <td>{DateUtil.dateTimeToString(new Date(entry.createdAt))}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}