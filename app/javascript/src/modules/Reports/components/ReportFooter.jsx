import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles';
import React from 'react'
import { useTranslation } from 'react-i18next';

export default function ReportFooter(){
    const { t } = useTranslation('report')
    const classes = useStyles()
    return (
      <Grid container>
        <Grid item xs={6}>
          <div style={{ marginTop: 100, textAlign: 'center' }}>
            <hr className={classes.hr} />
            <Grid container spacing={1}>
              <Grid item xs className={classes.title}>
                -
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs className={classes.title}>
                {t('misc.sub_admin')}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs className={classes.title}>
                {t('misc.customs_post')}
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div style={{ marginTop: 100}}>
            <hr className={classes.hr} />
            <Grid
              container
              direction="column"
              alignItems="center"
              spacing={1}
            >
              <Grid item className={classes.title}>
                <b>Ciudad Moraźan</b>
              </Grid>
            </Grid>
            <Grid
              container
              direction="column"
              alignItems="center"
              spacing={1}
            >
              <Grid item className={classes.title}>
                {t('misc.customs_admin')}
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    )
}

const useStyles = makeStyles({
    title: {
      fontWeight: 400,
      fontSize: '16px',
      color: '#656565'
    },
    hr: {
        width: '70%',
        height: 1,
        backgroundColor: '#000000'
      }
  });
