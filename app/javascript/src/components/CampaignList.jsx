import React, { Fragment } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { useQuery } from 'react-apollo'
import { useHistory } from 'react-router-dom'
import { allCampaigns } from '../graphql/queries'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'
import { dateTimeToString, dateToString } from '../components/DateContainer'
import { Button } from '@material-ui/core'

export default function CampaignList() {
  const history = useHistory()
  const { data, error, loading } = useQuery(allCampaigns,{fetchPolicy: "cache-and-network"})
  function routeToAction(_event, id) {
    return history.push(`/campaign/${id}`)
  }
  if (loading) return <Loading />
  if (error) return <ErrorPage />
console.log(data)
  return (
    <div className="container">
      { data.campaigns.map(c => (
        <Fragment key={c.id}>
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-xs-8">
                <span className={css(styles.logTitle)} data-testid="c_name" >{c.name}</span>
              </div>
              <div className="col-xs-4">
                <span className={css(styles.access)}>
                  <strong>Batch Time </strong>
                </span>
                <span className={css(styles.subTitle)}>
                  {dateTimeToString(new Date(c.batchTime))}
                </span>
              </div>
            </div>
            <div className="row justify-content-between">
              <div className="col-xs-4">
                <span className={css(styles.subTitle)}>
                  <strong>{dateToString(c.batchTime)}</strong>
                </span>
              </div>
              <div className="col-xs-8">
                <span className={css(styles.subTitle)} data-testid="c_message" >{c.message}</span>
              </div>
            </div>
            <br />
            <div className="row justify-content-between">
              <div className="col-xs-4">
                <Button
                  style={{
                    cursor: 'pointer',
                    color: '#009688'
                  }}
                  data-testid="more_details_btn"
                  onClick={(event) => routeToAction(event, c.id)}
                >
                  More Details
                </Button>
              </div>
            </div>
            <br />
          </div>

          <div className="border-top my-3" />
        </Fragment>
      ))}
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
