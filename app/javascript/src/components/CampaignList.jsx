import React, { Fragment,useContext } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { useQuery } from 'react-apollo'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import { useHistory } from 'react-router-dom'
import { allCampaigns } from '../graphql/queries'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'
import { dateTimeToString, dateToString } from '../components/DateContainer'
import {Context as ThemeContext} from '../../Themes/Nkwashi/ThemeProvider'

export default function CampaignList() {
  const history = useHistory()
  const theme = useContext(ThemeContext)
  const { data, error, loading } = useQuery(allCampaigns, {
    fetchPolicy: 'cache-and-network'
  })
  function routeToAction(_event, id) {
    return history.push(`/campaign/${id}`)
  }
  function routeToCreateCampaign() {
    return history.push('/campaign-create')
  }
  if (loading) return <Loading />
  if (error) return <ErrorPage />

  return (
    <div className="container">
      {data.campaigns.map(c => (
        <Fragment key={c.id}>
    <div>
        <Grid container spacing={2}>
          <Grid item container direction="column" spacing={2}>
            <Grid item>
              <Typography className={css(style.logTitle)} gutterBottom variant="subtitle1" data-testid="c_name">{c.name}</Typography>
              <Typography className={css(style.subTitle)} variant="body2" data-testid="c_message" color="textSecondary">{c.message}</Typography>
            </Grid>
            <Grid item>
              <Typography className={css(style.subTitle)} variant="body2" gutterBottom >
                <strong>Scheduled Date: </strong>{dateToString(c.batchTime)}  <strong>Scheduled Time: </strong>{dateTimeToString(new Date(c.batchTime))}
              </Typography>
            </Grid>
            <Grid item>
              <Grid item container direction="row" spacing={2}>
                <Grid item>
                  <Badge max={9999} color="primary" badgeContent={c.campaignMetrics.totalScheduled}>
                    <Typography className={css(style.subTitle)} >Total Scheduled</Typography>
                  </Badge>
                </Grid>
                <Grid item>
                  <Badge max={9999} color="primary" badgeContent={c.campaignMetrics.totalSent}>
                    <Typography className={css(style.subTitle)} >Total Sent</Typography>
                  </Badge>
                </Grid>
                <Grid item>
                  <Badge max={9999} color="primary" badgeContent={c.campaignMetrics.totalClicked}>
                    <Typography className={css(style.subTitle)} >Total Clicked</Typography>
                  </Badge>
                </Grid>
                <Grid item>
                  <Badge max={9999} color="primary" badgeContent={String((100 * c.campaignMetrics.totalClicked) /(c.campaignMetrics.totalSent && c.campaignMetrics.totalSent > 0 ? c.campaignMetrics.totalSent : 1))}>
                    <Typography className={css(style.subTitle)}>% Success</Typography>
                  </Badge> 
                </Grid>
              </Grid>                             
            </Grid>
            <Grid item>
              <Typography variant="body1" style={{ cursor: 'pointer', color: '#009688' }}>
                <Link data-testid="more_details_btn" href="#" style={{ cursor: 'pointer', color: '#009688' }} onClick={event => routeToAction(event, c.id)}>More Details</Link>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
    </div>
          <div className="border-top my-3" />
        </Fragment>
      ))}
      <Fab
        variant="extended"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 57,
          color: 'white',
          backgroundColor: theme.primaryColor
        }}
        
        onClick={() => {
          routeToCreateCampaign()
        }}
        color="inherit"
      >
        <AddIcon /> Create
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
