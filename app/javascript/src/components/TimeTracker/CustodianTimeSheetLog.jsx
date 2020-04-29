import React from 'react'
import dateutil from '../../utils/dateutil'
import { useHistory } from 'react-router'
import { StyleSheet, css } from 'aphrodite'
import { zonedDate } from '../DateContainer'

export default function CustodianTimeSheetLog({ data }) {
  const history = useHistory()

  function routeToEmployee({userId, name}){
    history.push({
      pathname: `/timesheet/${userId}`,
      state: {
        name
      }
    })
  }

  return (
    <div>
      <div className="container">
        <br />
        <br />
        {data.timeSheetLogs.map(shift => (
          <React.Fragment key={shift.id}>
            <div className="row justify-content-between">
              <div className="col-xs-8 nz_user">
                <strong>{shift.user.name}</strong>
              </div>
              <div className="col-xs-4">
                <span className={css(styles.subTitle)}>
                  Last shift worked:{' '}
                  {dateutil.dateToString(zonedDate(shift.startedAt))}
                </span>
              </div>
            </div>
            <div className="row justify-content-between">
              <div className="col-xs-8"></div>
              <div className="col-xs-4 nz_endshift">
                <span className={css(styles.subTitle)}>
                  Numbers of shifts hours worked:{' '}
                  {shift.endedAt
                    ? dateutil.differenceInHours(
                        zonedDate(shift.startedAt),
                        zonedDate(shift.endedAt)
                      )
                    : 'In-Progress'}
                </span>
              </div>
            </div>
            <div className="d-flex flex-row-reverse">
              <span
                style={{
                  cursor: 'pointer',
                  color: '#009688'
                }}
                onClick={() =>
                  routeToEmployee({
                    userId: shift.userId,
                    name: shift.user.name
                  })
                }
              >
                More Details
              </span>
            </div>
            <div className="border-top my-3" />
          </React.Fragment>
        ))}
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