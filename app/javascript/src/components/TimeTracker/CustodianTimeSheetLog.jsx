import React from 'react'
import { useQuery } from 'react-apollo'
import { TimeSheetLogsQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'
import dateutil from '../../utils/dateutil'
import { useHistory } from 'react-router'
import { Typography } from '@material-ui/core'
import Nav from '../Nav'

export default function EmployeeTimeSheetLog() {
  const { loading, data, error } = useQuery(TimeSheetLogsQuery)
  const history = useHistory()
  if (loading) return <Spinner />
  if (error) return <span>{error.message}</span>


  return (

    <div>
      <Nav navName="Timesheet" menuButton="back" backTo="/" />

      <div className="container">

        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Filter Entries"
          />
        </div>

        <br />
        <br />

        {
          data.timeSheetLogs.map(event => (
            <React.Fragment key={event.id} >
              <div className="row justify-content-between" onClick={() => history.push(`/timesheet/${event.refId}`)} >
                <div className="col-xs-8">
                  <span >event.data.ref_name</span>
                </div>
                <div className="col-xs-4">
                  <span >
                    <strong>Last shift worked: {dateutil.dateToString(new Date(event.data.shift.start_date))}</strong>
                  </span>
                </div>
              </div>
              <div className="row justify-content-between">
                <div className="col-xs-8">
                </div>
                <div className="col-xs-4">
                  <span >
                    <strong>Numbers of shifts hours worked: </strong>
                  </span>
                </div>
              </div>
              <div className="d-flex flex-row-reverse">
                <Typography variant="caption" color='textSecondary'>More Details</Typography>
              </div>
              <br />
              <div className="border-top my-3" />
            </React.Fragment>

          ))
        }

      </div>
    </div>
  )
}
