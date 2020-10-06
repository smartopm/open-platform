import React from 'react'
import { useQuery } from 'react-apollo'
import { Grid, Typography, Container } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles"
import PropTypes from 'prop-types'
import { LabelsQuery } from '../../graphql/queries'
import ErrorPage from '../Error'
import Loading from '../Loading'
import LabelItem from './LabelItem'

export default function LabelList({ userType }) {
  const { data, error, loading } = useQuery(LabelsQuery)

  if (loading) return <Loading />
  if (error) {
    return <ErrorPage title={error.message} />
  }
  return (
    <Container>
      <LabelPageTitle />
      <br />
      {data?.labels.map(label => (
        <LabelItem
          key={label.id}
          label={label}
          userType={userType}
          userCount={label.users.length}
        />
      ))}
    </Container>
  )
}

function LabelPageTitle(){
  // eslint-disable-next-line no-use-before-define
  const classes = useStyles()
  return (
    <Grid container spacing={3} className={classes.labelTitle}>
      <Grid item xs={3}>
        <Typography variant="subtitle2" data-testid="label-name" className={classes.label}>
          Labels
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="subtitle2" data-testid="label-name">
          Total Number of users
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="subtitle2" data-testid="label-name">
          Description
        </Typography>
      </Grid>
    </Grid>
  )
}

LabelList.propTypes = {
  userType: PropTypes.string.isRequired
}
const useStyles = makeStyles(() => ({
  labelTitle: {
    marginTop: '5%'
  },
  label: {
    marginLeft: 20
  }
}));