import React from 'react'
import { useQuery } from 'react-apollo'
import { TimeSheetLogsQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'
import dateutil from '../../utils/dateutil'
import { useHistory } from 'react-router'
import { Typography } from '@material-ui/core'
import Nav from '../Nav'
import { StyleSheet, css } from 'aphrodite'
import { zonedDate } from '../DateContainer'

export default function EmployeeTimeSheetLog() {
  const { loading, data, error } = useQuery(TimeSheetLogsQuery)
  const history = useHistory()
  if (loading) return <Spinner />
  if (error) return <span>{error.message}</span>


  return (

    <div>
      <Nav navName="Timesheet" menuButton="back" backTo="/" />

      <div className="container">
        <br />
        
        <br />
        {
          data.timeSheetLogs.map(shift => (
            <React.Fragment key={shift.id} >
              <div className="row justify-content-between" onClick={() => history.push(`/timesheet/${shift.userId}`)} >
                <div className="col-xs-8">
                  <strong >{shift.user.name}</strong>
                </div>
                <div className="col-xs-4">
                  <span className={css(styles.subTitle)}>
                    Last shift worked: {dateutil.dateToString(zonedDate(shift.startedAt))}
                  </span>
                </div>
              </div>
              <div className="row justify-content-between">
                <div className="col-xs-8">
                </div>
                <div className="col-xs-4">
                  <span className={css(styles.subTitle)}>
                    Numbers of shifts hours worked: {dateutil.differenceInHours(zonedDate(shift.startedAt), zonedDate(shift.endedAt || new Date())) }
                  </span>
                </div>
              </div>
              <div className="d-flex flex-row-reverse">
                <span
                  style={{
                    cursor: 'pointer',
                    color: '#009688'
                  }}
                  onClick={() => history.push(`/timesheet/${shift.userId}`)}
                >
                  More Details
                </span>
              </div>
              <div className="border-top my-3" />
            </React.Fragment>

          ))
        }

      </div>
    </div>
  )
}


const styles = StyleSheet.create({
  logTitle: {
    color: '#1f2026',
    fontSize: 16,
    fontWeight: 700
  },
  subTitle: {
    color: '#818188',
    fontSize: 14,
    letterSpacing: 0.17,
    fontWeight: 400
  }
})