/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { useQuery } from 'react-apollo'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import { useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { allCampaigns } from '../graphql/queries'
import Loading from "./Loading"
import ErrorPage from "./Error"
import { dateTimeToString, dateToString } from "./DateContainer"
import CampaignDeleteAction from "./Campaign/CampaignDeleteAction"
import CenteredContent from './CenteredContent'
import Paginate from './Paginate'

export default function CampaignList() {
  const history = useHistory()
  const limit = 50
  const [offset, setOffset] = useState(0)
  const { data, error, loading, refetch } = useQuery(allCampaigns, {
    variables: { limit, offset },
    fetchPolicy: 'cache-and-network'
  })
  function routeToAction(_event, id) {
    return history.push(`/campaign/${id}`)
  }
  function routeToCreateCampaign() {
    return history.push('/campaign-create')
  }

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) {
        return
      }
      setOffset(offset - limit)
    } else if (action === 'next') {
      setOffset(offset + limit)
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorPage />
  return (
    <div className="container">
      {data.campaigns.map(camp => (
        <Fragment key={camp.id}>
          <div>
            <Grid container spacing={2}>
              <Grid item container direction="column" spacing={2}>
                <Grid item>
                  <Typography
                    className={css(style.logTitle)}
                    gutterBottom
                    variant="subtitle1"
                    data-testid="c_name"
                  >
                    {camp.name}
                  </Typography>
                  <Typography
                    className={css(style.subTitle)}
                    variant="body2"
                    data-testid="c_message"
                    color="textSecondary"
                  >
                    {camp.message}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    className={css(style.subTitle)}
                    variant="body2"
                    gutterBottom
                  >
                    <strong>Scheduled Date: </strong>
                    {dateToString(camp.batchTime)}
                    {' '}
                    <strong>Scheduled Time: </strong>
                    {dateTimeToString(new Date(camp.batchTime))}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid item container direction="row" spacing={2}>
                    <Grid item>
                      <Typography className={css(style.subTitle)}>
                        Total Scheduled: 
                        {' '}
                        {camp.campaignMetrics.totalScheduled}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography className={css(style.subTitle)}>
                        Total Sent: 
                        {' '}
                        {camp.campaignMetrics.totalSent}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography className={css(style.subTitle)}>
                        Total Clicked: 
                        {' '}
                        {camp.campaignMetrics.totalClicked}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography className={css(style.subTitle)}>
                        Success: 
                        {' '}
                        {String(parseInt(
                        (100 * camp.campaignMetrics.totalClicked) /
                          (camp.campaignMetrics.totalSent &&
                            camp.campaignMetrics.totalSent > 0
                            ? camp.campaignMetrics.totalSent
                            : 1), 10)
                      )}
                        %
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item container direction="row">
                  <Typography
                    variant="body1"
                    style={{ cursor: 'pointer', color: '#009688', marginTop: "11px" }}
                  >
                    <Link
                      data-testid="more_details_btn"
                      href="#"
                      style={{ cursor: 'pointer', color: '#69ABA4' }}
                      onClick={event => routeToAction(event, camp.id)}
                    >
                      More Details
                    </Link>
                  </Typography>
                  {(camp.status === "draft" || camp.status === "scheduled") && (
                    <CampaignDeleteAction data={camp} refetch={refetch} />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </div>
          <div className="border-top my-3" />
        </Fragment>
      ))}

      <br />
      <CenteredContent>
        <Paginate
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={paginate}
        />
      </CenteredContent>
      <Fab
        variant="extended"
        color="primary"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 57,
          color: 'white',
        }}
        onClick={() => {
          routeToCreateCampaign()
        }}
      >
        <AddIcon />
        {' '}
        Create
      </Fab>
    </div>
  )
}

const style = StyleSheet.create({
  logTitle: {
    color: '#1f2026',
    fontSize: 16,
    fontWeight: 700
  },
  subTitle: {
    color: 'black',
    fontSize: 14,
    letterSpacing: 0.17,
    fontWeight: 400
  },
})
