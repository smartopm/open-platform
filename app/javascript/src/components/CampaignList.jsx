import React, { Fragment, useState, useContext } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { useQuery } from 'react-apollo'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import { useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { IconButton } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import { allCampaigns } from '../graphql/queries'
import Loading from './Loading'
import ErrorPage from './Error'
import { dateTimeToString, dateToString } from './DateContainer'
import CampaignActionMenu from './Campaign/CampaignActionMenu'
import { Context as AuthStateContext } from '../containers/Provider/AuthStateProvider'

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
  }
})

export default function CampaignList() {
  const authState = useContext(AuthStateContext)
  const history = useHistory()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const styles = StyleSheet.create({
    linkItem: {
      color: '#000000',
      textDecoration: 'none'
    }
  })

  const { data, error, loading, refetch } = useQuery(allCampaigns, {
    fetchPolicy: 'cache-and-network'
  })

  function routeToCreateCampaign() {
    return history.push('/campaign-create')
  }

  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  if (loading) return <Loading />
  if (error) return <ErrorPage />

  return (
    <div className="container">
      <List>
        {data.campaigns.map(campaign => (
          <Fragment key={campaign.id}>
            <ListItem>
              <Grid container spacing={2}>
                <Grid item container direction="column" spacing={2}>
                  <Grid item>
                    <Typography
                      className={css(style.logTitle)}
                      gutterBottom
                      variant="subtitle1"
                      data-testid="c_name"
                    >
                      {campaign.name}
                    </Typography>
                    <Typography
                      className={css(style.subTitle)}
                      variant="body2"
                      data-testid="c_message"
                      color="textSecondary"
                    >
                      {campaign.message}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      className={css(style.subTitle)}
                      variant="body2"
                      gutterBottom
                    >
                      <strong>Scheduled Date: </strong>
                      {dateToString(campaign.batchTime)}{' '}
                      <strong>Scheduled Time: </strong>
                      {dateTimeToString(new Date(campaign.batchTime))}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Grid item container direction="row" spacing={2}>
                      <Grid item>
                        <Typography className={css(style.subTitle)}>
                          Total Scheduled: {campaign.campaignMetrics.totalScheduled}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography className={css(style.subTitle)}>
                          Total Sent: {campaign.campaignMetrics.totalSent}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography className={css(style.subTitle)}>
                          Total Clicked: {campaign.campaignMetrics.totalClicked}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography className={css(style.subTitle)}>
                          Success: {String(parseInt(
                          (100 * c.campaignMetrics.totalClicked) /
                            (c.campaignMetrics.totalSent &&
                            c.campaignMetrics.totalSent > 0
                              ? c.campaignMetrics.totalSent
                              : 1))
                        )}%
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
                <CampaignActionMenu
                  userType={authState.user.userType}
                  data={campaign}
                  anchorEl={anchorEl}
                  handleClose={handleClose}
                  open={open}
                  linkStyles={css(styles.linkItem)}
                  refetch={refetch}
                />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={handleOpenMenu}
                >
                  <MoreVertIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <div className="border-top my-3" />
        </Fragment>
        ))}
      </List>
      <Fab
        variant="extended"
        color="primary"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 57,
          color: 'white'
        }}
        onClick={() => {
          routeToCreateCampaign()
        }}
      >
        <AddIcon /> Create
      </Fab>
    </div>
  )
}
