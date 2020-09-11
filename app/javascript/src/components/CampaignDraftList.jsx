/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { css } from 'aphrodite'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

export default function CampaignDraftList({ style, routeToAction, data: { id, name, message } }) {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item container direction="column" spacing={2}>
          <Grid item>
            <Typography
              className={css(style.logTitle)}
              gutterBottom
              variant="subtitle1"
              data-testid="data_name"
            >
              {name}
            </Typography>
            <Typography
              className={css(style.subTitle)}
              variant="body2"
              data-testid="c_message"
              color="textSecondary"
            >
              {message || ""}
            </Typography>
          </Grid>
          <Grid item>
            <Grid item container direction="row">
              <Grid item>
                <Typography className={css(style.subTitle)}>
                  Status: 
                  {' '}
                  Draft
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography
              variant="body1"
              style={{ cursor: 'pointer', color: '#009688' }}
            >
              <Link
                data-testid="more_details_btn"
                href="#"
                style={{ cursor: 'pointer', color: '#69ABA4' }}
                onClick={event => routeToAction(event, id)}
              >
                More Details
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

