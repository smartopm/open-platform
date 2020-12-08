/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
import React, {
  useState, Fragment, useContext, useEffect
} from 'react'
import { useQuery } from 'react-apollo'
import { useLocation } from 'react-router-dom'
import { StyleSheet, css } from 'aphrodite'
import Nav from '../../components/Nav'
import Loading from '../../components/Loading'
import { AllEventLogsQuery } from '../../graphql/queries'
import ErrorPage from '../../components/Error'
import { Footer } from '../../components/Footer'
import { userType } from '../../utils/constants'
import useDebounce from '../../utils/useDebounce'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider'
import {
  StyledTabs,
  StyledTab,
  TabPanel,
  a11yProps
} from '../../components/Tabs'
import { dateTimeToString, dateToString } from '../../components/DateContainer'
import FloatButton from '../../components/FloatButton'

export default ({ history, match }) => AllEventLogs(history, match)

// Todo: Find the total number of allEventLogs
const initialLimit = 50
const AllEventLogs = (history, match) => {
  const subjects = ['user_entry', 'visitor_entry', 'showroom', 'user_temp']
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(initialLimit)
  const [searchTerm, setSearchTerm] = useState('')
  const [value, setvalue] = useState(0)
  const dbcSearchTerm = useDebounce(searchTerm, 500);

  const refId = match.params.userId || null

  useEffect(
    () => {
      setSearchTerm(dbcSearchTerm)
    },
    [dbcSearchTerm]
  );

  function getQuery() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return new URLSearchParams(useLocation().search);
  }

  const query = getQuery()

  useEffect(() => {
    const offsetParams = query.get('offset')
    setOffset(Number(offsetParams))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { loading, error, data } = useQuery(AllEventLogsQuery, {
    variables: {
      subject: value === 0 ? subjects : 'user_enrolled',
      refId,
      refType: null,
      offset,
      limit,
      name: dbcSearchTerm
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
  function handleLimit() {
    setLimit(1000)
  }
  function handleSearch(event) {
    setSearchTerm(event.target.value)
  }

  function handleChange(_event, newValue) {
    setvalue(newValue)
  }

  return (
    <IndexComponent
      data={data}
      previousPage={handlePreviousPage}
      offset={offset}
      nextPage={handleNextPage}
      router={history}
      handleLimit={handleLimit}
      limit={limit}
      searchTerm={searchTerm}
      handleSearch={handleSearch}
      handleTabValue={handleChange}
      tabValue={value}
    />
  )
}

export function IndexComponent({
  data,
  router,
  nextPage,
  previousPage,
  offset,
  limit,
  searchTerm,
  handleSearch,
  tabValue,
  handleTabValue
}) {
  const authState = useContext(AuthStateContext)

  function routeToAction(eventLog) {
    if (eventLog.refType === 'EntryRequest') {
      router.push({
        pathname: `/request/${eventLog.refId}`,
        state: { from: 'logs', offset }
      })
    } if (eventLog.refType === 'User') {
      router.push({
        pathname: `/user/${eventLog.refId}`,
        state: { from: 'logs', offset }
      })
    }
  }

  function enrollUser(id) {
    return router.push({
      pathname: `/request/${id}`,
      state: { from: 'enroll', offset }
    })
  }

  function logs(eventLogs) {
    if (!eventLogs) {
      return 'No Entry logs yet'
    }

    return eventLogs.map((event) => {
      // Todo: To be followed up
      const source = event.subject === 'user_entry'
        ? 'Scan'
        : event.subject === 'showroom'
          ? 'Showroom'
          : 'Manual'
      const isDigital = source === 'Scan' ? event.data.digital : null
      const reason = event.entryRequest ? event.entryRequest.reason : ''

      const accessStatus = event.entryRequest && event.entryRequest.grantedState === 1
        ? 'Granted Access: '
        : event.entryRequest && event.entryRequest.grantedState === 2
          ? 'Denied Access: '
          : ''

      const enrolled = event.data.enrolled || false
      const visitorName = event.data.ref_name || event.data.visitor_name || event.data.name
      return (
        <Fragment key={event.id}>
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-xs-8">
                <span className={css(styles.logTitle)}>{visitorName}</span>
              </div>
              <div className="col-xs-4">
                <span className={css(styles.access)}>
                  <strong>
                    {accessStatus}
                    {' '}
                  </strong>
                </span>
                <span className={css(styles.subTitle)}>
                  {dateToString(event.createdAt)}
                </span>
              </div>
            </div>
            <div className="row justify-content-between">
              <div className="col-xs-8">
                <span className={css(styles.subTitle)}>{reason}</span>
              </div>
              <div className="col-xs-4">
                <span className={css(styles.subTitle)}>
                  {dateTimeToString(new Date(event.createdAt))}
                </span>
              </div>
            </div>
            <br />
            <div className="row justify-content-between">
              <div className="col-xs-8">
                <span className={css(styles.subTitle)}>
                  {event.actingUser && event.actingUser.name}
                </span>
              </div>
              <div className="col-xs-4">

                {/* Temperature status placeholder */}
                <span className={css(styles.subTitle)}>
                  {' '}
                  { /* eslint-disable-next-line no-useless-concat */}
                  {event.subject === 'user_temp' ? 'Temperature Recorded |' + ' ' : ''}
                </span>

                <span className={css(styles.subTitle)}>
                  {source !== 'Scan' && authState.user.userType === 'admin' && !enrolled ? (
                    <>
                      <span
                        style={{
                          cursor: 'pointer',
                          color: '#009688'
                        }}
                        onClick={() => enrollUser(event.refId)}
                      >
                        Enroll user
                        {' '}
                      </span>
                      |
                      {' '}
                      {source}
                    </>
                  ) : source === 'Scan' && isDigital !== null ? (
                    `${isDigital ? 'Digital' : 'Print'} Scan`
                  ) : (
                    source
                  )}
                  {' '}
                  |
                  {' '}
                  <span
                    style={{
                      cursor: 'pointer',
                      color: '#009688'
                    }}
                    onClick={() => {
                      routeToAction(event)
                    }}
                  >
                    More Details
                  </span>
                </span>
              </div>
            </div>
            <br />
          </div>

          <div className="border-top my-3" />
        </Fragment>
      )
    })
  }

  const filteredEvents = data.result
    && data.result.filter((log) => {
      const visitorName = log.data.ref_name || log.data.visitor_name || log.data.name || ''
      return visitorName.toLowerCase().includes(searchTerm.toLowerCase())
    })
  return (
    <div>
      <div
        style={{
          backgroundColor: '#69ABA4'
        }}
      >
        <Nav menuButton="back" navName="Log Book" boxShadow="none" backTo="/" />
      </div>
      <div className="container">
        <div className="form-group">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="form-control"
            placeholder="Filter Entries"
          />
        </div>
      </div>
      <div>
        <StyledTabs
          value={tabValue}
          onChange={handleTabValue}
          aria-label="simple tabs example"
          centered
        >
          <StyledTab label="All Visits" {...a11yProps(0)} />
          <StyledTab label="New Visits" {...a11yProps(1)} />
          <StyledTab label="Upcoming Visits" />
        </StyledTabs>
        <TabPanel value={tabValue} index={0}>
          <>{logs(filteredEvents)}</>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {/* Todo: Handle the listing of enrolled users here */}

          {data.result.map((user) => (
            <Fragment key={user.id}>
              <div className="container">
                <div className="row justify-content-between">
                  <div className="col-xs-8">
                    <span className={css(styles.logTitle)}>{user.data.ref_name}</span>
                  </div>
                  <div className="col-xs-4">
                    <span className={css(styles.subTitle)}>
                      {dateToString(user.createdAt)}
                    </span>
                  </div>
                </div>
                <br />
                <div className="row justify-content-between">
                  <div className="col-xs-8">
                    <span className={css(styles.subTitle)}>{userType[user.data.type || '']}</span>
                  </div>
                  <div className="col-xs-4">
                    <span className={css(styles.subTitle)}>
                      {dateTimeToString(new Date(user.createdAt))}
                    </span>
                  </div>
                </div>
                <br />
                <div className="border-top my-3" />
              </div>
            </Fragment>
          ))}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          Upcoming
        </TabPanel>    
        <FloatButton 
          title="New Visit Request"
          handleClick={() => {}}
        />
      </div>

      <div className="d-flex justify-content-center">
        <nav aria-label="center Page navigation">
          <ul className="pagination">
            <li className={`page-item ${offset < limit && 'disabled'}`}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="page-link" onClick={previousPage} href="#">
                Previous
              </a>
            </li>
            <li
              className={`page-item ${filteredEvents.length < limit
                && 'disabled'}`}
            >
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="page-link" onClick={nextPage} href="#">
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <Footer position="3vh" />
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
  },
  access: {
    color: '#1f2026',
    fontSize: 14,
    letterSpacing: 0.17,
    fontWeight: 400
  }
})
