import React, { useState, Fragment, useContext } from 'react'
import { useQuery } from 'react-apollo'
import Nav from '../../components/Nav'
import { StyleSheet, css } from 'aphrodite'
import Loading from '../../components/Loading.jsx'
import DateUtil from '../../utils/dateutil.js'
import { AllEventLogsQuery } from '../../graphql/queries.js'
import ErrorPage from '../../components/Error'
import { Footer } from '../../components/Footer'
import newUserIcon from '../../../../assets/images/new.svg'
import gateIcon from '../../../../assets/images/bar.svg'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import {
  StyledTabs,
  StyledTab,
  TabPanel,
  a11yProps
} from '../../components/Tabs'

export default ({ history, match }) => {
  return allEventLogs(history, match)
}

// Todo: Find the total number of allEventLogs
const initialLimit = 50
const allEventLogs = (history, match) => {
  const subjects = ['user_entry', 'visitor_entry', 'showroom']
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(initialLimit)
  const [searchTerm, setSearchTerm] = useState('')
  const [value, setvalue] = useState(0)

  const refId = match.params.userId || null
  const { loading, error, data } = useQuery(AllEventLogsQuery, {
    variables: {
      subject: value === 0 ? subjects : 'user_enrolled',
      refId: refId,
      refType: null,
      offset,
      limit: searchTerm.length < 4 ? 250 : initialLimit
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
    handleLimit()
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
      return router.push({
        pathname: `/request/${eventLog.refId}`,
        state: { from: 'logs' }
      })
    } else if (eventLog.refType === 'User') {
      return router.push(`/user/${eventLog.refId}`)
    }
  }

  function enrollUser(id) {
    return router.push({
      pathname: `/request/${id}`,
      state: { from: 'enroll' }
    })
  }

  function logs(eventLogs) {
    if (!eventLogs) {
      return 'No Entry logs yet'
    }

    return eventLogs.map(event => {
      // Todo: To be followed up
      const source =
        event.subject === 'user_entry'
          ? 'Scan'
          : event.subject === 'showroom'
            ? 'Showroom'
            : 'Manual'
      const isDigital = source === 'Scan' ? event.data.digital : null
      const reason = event.entryRequest ? event.entryRequest.reason : ''
      const visitorName =
        event.data.ref_name || event.data.visitor_name || event.data.name
      return (
        <Fragment key={event.id}>
          <div className="container">
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
                <span className={css(styles.subTitle)}>
                  {source !== 'Scan' && authState.user.userType === 'admin' ? (
                    <Fragment>
                      <span
                        style={{
                          cursor: 'pointer',
                          color: '#009688'
                        }}
                        onClick={() => enrollUser(event.refId)}
                      >
                        Enroll user{' '}
                      </span>
                      | {source}
                    </Fragment>
                  ) : source === 'Scan' && isDigital !== null ? (
                    `${isDigital ? 'Digital' : 'Print'} Scan`
                  ) : (
                        source
                      )}{' '}
                  |{' '}
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



  const filteredEvents =
    data.result &&
    data.result.filter(log => {
      const visitorName =
        log.data.ref_name || log.data.visitor_name || log.data.name
      return visitorName.toLowerCase().includes(searchTerm.toLowerCase())
    })
  return (
    <div>
      <div
        style={{
          backgroundColor: '#25c0b0'
        }}
      >
        <Nav menuButton="back" navName="Log Book" boxShadow={'none'}  backTo="/"/>
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
          <StyledTab icon={<img src={gateIcon} style={{height: 30, width: 30}}/>}  {...a11yProps(0)} />
          <StyledTab icon={<img src={newUserIcon} style={{height: 30, width: 30}}/>} {...a11yProps(1)} />
        </StyledTabs>
        <TabPanel value={tabValue} index={0}>
          <>{logs(filteredEvents)}</>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {/*Todo: Handle the listing of enrolled users here*/}

         {data.result.map(user => {

           return(
             <Fragment key={user.id}>
            <div className="container">
              <div className="row justify-content-between">
                <div className="col-xs-8">
                  <span className={css(styles.logTitle)}>{user.data.ref_name}</span>
                </div>
                <div className="col-xs-4">
                  <span className={css(styles.subTitle)}>
                    {DateUtil.dateToString(new Date(user.createdAt))}
                  </span>
                </div>
              </div>
              <br />
              <div className="row justify-content-between">
                <div className="col-xs-8">
                  <span className={css(styles.subTitle)}>{user.data.type === 'prospective_client' ? 'Prospective Client' : user.data.type }</span>
                </div>
                <div className="col-xs-4">
                  <span className={css(styles.subTitle)}>
                    {DateUtil.dateTimeToString(new Date(user.createdAt))}
                  </span>
                </div>
              </div>
              <br />
              <div className="border-top my-3" />
            </div>

            </Fragment>
           )
          })}
        </TabPanel>
      </div>

      <div className="d-flex justify-content-center">
        <nav aria-label="center Page navigation">
          <ul className="pagination">
            <li className={`page-item ${offset < limit && 'disabled'}`}>
              <a className="page-link" onClick={previousPage} href="#">
                Previous
              </a>
            </li>
            <li
              className={`page-item ${filteredEvents.length < limit &&
                'disabled'}`}
            >
              <a className="page-link" onClick={nextPage} href="#">
                Next
              </a>
            </li>
          </ul>
        </nav>
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
