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
import { useTranslation } from 'react-i18next'
import { TextField, Typography } from '@material-ui/core'
import Loading from '../../../shared/Loading'
import { AllEventLogsQuery } from '../../../graphql/queries'
import ErrorPage from '../../../components/Error'
import { Footer } from '../../../components/Footer'
import useDebounce from '../../../utils/useDebounce'
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'
import {
  StyledTabs,
  StyledTab,
  TabPanel,
  a11yProps
} from '../../../components/Tabs'
import { dateTimeToString, dateToString } from '../../../components/DateContainer'
import FloatButton from '../../../components/FloatButton'
import { propAccessor } from '../../../utils/helpers'

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

  const logsQuery = {
    0: subjects,
    1: 'user_enrolled',
    2: 'visit_request'
  }

  const { loading, error, data } = useQuery(AllEventLogsQuery, {
    variables: {
      subject: propAccessor(logsQuery, value),
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
  const { t } = useTranslation(['logbook', 'common', 'dashboard'])

  function routeToAction(eventLog) {
    if (eventLog.refType === 'EntryRequest') {
      router.push({
        pathname: `/request/${eventLog.refId}`,
        state: { from: 'entry_logs', offset }
      })
    } if (eventLog.refType === 'User') {
      router.push({
        pathname: `/user/${eventLog.refId}`,
        state: { from: 'entry_logs', offset }
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
      return t('logbook.no_entry')
    }

    return eventLogs.map((event) => {
      // Todo: To be followed up
      const source = event.subject === 'user_entry'
        ? t('dashboard:dashboard.scan')
        : event.subject === 'showroom'
          ? t('logbook.showroom')
          : t('dashboard:dashboard.log_entry')
          
      const isDigital = event.subject === 'user_entry' ? event.data.digital : null
      const reason = event.entryRequest ? event.entryRequest.reason : ''

      const accessStatus = event.entryRequest && event.entryRequest.grantedState === 1
        ? `${t('logbook.granted_access')}: `
        : event.entryRequest && event.entryRequest.grantedState === 2
          ? `${t('logbook.denied_access')}: `
          : ''

      const enrolled = event.data.enrolled || false
      const visitorName = event.data.ref_name || event.data.visitor_name || event.data.name
      return (
        <Fragment key={event.id}>
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-xs-8">
                <span className={`${css(styles.logTitle)} entry-log-visitor-name`}>{visitorName}</span>
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
                  {event.subject === 'user_temp' ? `${t('logbook.temperature_recorded')} |` : ''}
                </span>

                <span className={css(styles.subTitle)}>
                  {event.subject === 'visitor_entry' && authState.user.userType === 'admin' && !enrolled ? (
                    <>
                      <Typography
                        component="span"
                        color="primary"
                        style={{cursor: 'pointer'}}
                        onClick={() => enrollUser(event.refId)}
                      >
                        {t('logbook.enroll_user')}
                        {' '}
                      </Typography>
                      |
                      {' '}
                      {source}
                    </>
                  ) : event.subject === 'user_entry' && isDigital !== null ? (
                    isDigital ? t('logbook.digital_scan') : t('logbook.print_scan')
                  ) : (
                    source
                  )}
                  {' '}
                  |
                  {' '}
                  <Typography
                    component="span"
                    color="primary"
                    style={{cursor: 'pointer'}}
                    onClick={() => {
                      routeToAction(event)
                    }}
                  >
                    {t('common:misc.more_details')}
                  </Typography>
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
      <div className="container">
        <div className="form-group">
          <TextField
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="form-control"
            placeholder={t('logbook.filter_entries')}
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
          <StyledTab label={t('logbook.all_visits')} {...a11yProps(0)} />
          <StyledTab label={t('logbook.new_visits')} {...a11yProps(1)} />
          <StyledTab label={t('logbook.upcoming_visits')} {...a11yProps(2)} />
        </StyledTabs>
        <TabPanel value={tabValue} index={0}>
          <>{logs(filteredEvents)}</>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {/* Todo: Handle the listing of enrolled users here */}
          {data.result.map((user) => <LogView key={user.id} user={user} /> )}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {data.result.map((log) => <LogView key={log.id} user={log} /> )}
        </TabPanel>
        {
          // only admins should be able to schedule a visit request
          authState.user.userType === 'admin' && (
            <FloatButton
              title={t('logbook.new_visit_request')}
              handleClick={() => router.push('/visit_request')}
            />
          )
        }
      </div>

      <div className="d-flex justify-content-center">
        <nav aria-label="center Page navigation">
          <ul className="pagination">
            <li className={`page-item ${offset < limit && 'disabled'}`}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="page-link" onClick={previousPage} href="#">
                {t('common:misc.previous')}
              </a>
            </li>
            <li
              className={`page-item ${filteredEvents.length < limit
                && 'disabled'}`}
            >
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="page-link" onClick={nextPage} href="#">
                {t('common:misc.next')}
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <Footer position="3vh" />
    </div>
  )
}

export function LogView({ user }){
  const { t } = useTranslation('common')
  return (
    <>
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
            <span className={css(styles.subTitle)}>
              {t(`common:user_types.${user.data?.type}`)}
            </span>
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
    </>
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