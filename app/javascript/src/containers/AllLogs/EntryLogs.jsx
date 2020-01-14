import React, { useState, Fragment } from 'react'
import { useQuery } from 'react-apollo'
import Nav from '../../components/Nav'
import { StyleSheet, css } from 'aphrodite'
import Loading from '../../components/Loading.jsx'
import DateUtil from '../../utils/dateutil.js'
import { AllEventLogsQuery } from '../../graphql/queries.js'
import ErrorPage from '../../components/Error'
import { Footer } from '../../components/Footer'

export default ({ history, match }) => {
  const subjects = ['user_entry', 'visitor_entry', 'showroom']
  return allEventLogs(history, match, subjects)
}

// Todo: Find the total number of allEventLogs
const limit = 50
const allEventLogs = (history, match, subjects) => {
  const [offset, setOffset] = useState(0)
  const refId = match.params.userId || null
  const { loading, error, data } = useQuery(AllEventLogsQuery, {
    variables: {
      subject: subjects,
      refId: refId,
      refType: null,
      offset,
      limit
    },
    fetchPolicy: 'cache-and-network'
  })
  if (loading) return <Loading />
  if (error) return <ErrorPage title={error.message} />

  function handleNextPage() {
    setOffset(offset + limit)
  }
  function handlePreviousPage() {
    if (offset < limit) {
      return
    }
    setOffset(offset - limit)
  }
  console.log(data)
  return (
    <IndexComponent
      data={data}
      previousPage={handlePreviousPage}
      offset={offset}
      nextPage={handleNextPage}
      router={history}
    />
  )
}

export function IndexComponent({
  data,
  router,
  nextPage,
  previousPage,
  offset
}) {
  function routeToAction(eventLog) {
    if (eventLog.refType === 'EntryRequest') {
      return router.push({
        pathname: `/request/${eventLog.refId}`,
        state: { from: 'logs' }
      })
    } else if (eventLog.refType === 'User') {
      return router.push(`/user/${eventLog.refId}`)
    }
  }
  function logs(eventLogs) {
    if (!eventLogs) {
      return
    }
    return eventLogs.map(event => {
      console.log(event.subject)
      // Todo: To be followed up
      const source =
        event.subject === 'user_entry'
          ? 'Scan'
          : event.subject === 'showroom'
          ? 'Showroom'
          : 'Manual'
      const reason = event.entryRequest ? event.entryRequest.reason : ''
      const visitorName =
        event.data.ref_name || event.data.visitor_name || event.data.name
      return (
        <Fragment key={event.id}>
          <div
            className="container"
            onClick={() => routeToAction(event)}
            style={{
              cursor: 'pointer'
            }}
          >
            <div className="row justify-content-between">
              <div className="col-xs-8">
                <span className={css(styles.logTitle)}>{visitorName}</span>
              </div>
              <div className="col-xs-4">
                <span className={css(styles.subTitle)}>
                  {DateUtil.dateToString(new Date(event.createdAt))}
                </span>
              </div>
            </div>
            <div className="row justify-content-between">
              <div className="col-xs-8">
                <span className={css(styles.subTitle)}>{reason}</span>
              </div>
              <div className="col-xs-4">
                <span className={css(styles.subTitle)}>
                  {DateUtil.dateTimeToString(new Date(event.createdAt))}
                </span>
              </div>
            </div>
            <br />
            <div className="row justify-content-between">
              <div className="col-xs-8">
                <span className={css(styles.subTitle)}>
                  {event.actingUser.name}
                </span>
              </div>
              <div className="col-xs-4">
                <span className={css(styles.subTitle)}> {source}</span>
              </div>
            </div>
          </div>
          <div className="border-top my-3" />
        </Fragment>
      )
    })
  }
  return (
    <div>
      <div
        style={{
          backgroundColor: '#25c0b0'
        }}
      >
        <Nav menuButton="back" navName="Logs" boxShadow={'none'} />
      </div>
      <div className="container">
        <>{logs(data.result)}</>
        <div className="d-flex justify-content-center">
          <nav aria-label="center Page navigation">
            <ul className="pagination">
              <li className={`page-item ${offset < limit && 'disabled'}`}>
                <a className="page-link" onClick={previousPage} href="#">
                  Previous
                </a>
              </li>
              <li
                className={`page-item ${data.result.length < limit &&
                  'disabled'}`}
              >
                <a className="page-link" onClick={nextPage} href="#">
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <Footer position={'3vh'} />
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
