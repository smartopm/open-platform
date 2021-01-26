import React from 'react'
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'
import { makeStyles } from "@material-ui/core/styles";

export default function DetailsField({ title, value }){
  const classes = useStyles();
  return(
    <>
      <div className={classes.detail}>
        <Typography variant='body1' data-testid="title">{title}</Typography>
        :
        <Typography variant='body2' style={{margin: '2px 0 0 10px'}} data-testid="value">{value}</Typography>
      </div>
    </>
  )
}

const useStyles = makeStyles(() => ({
  detail: {
    display: 'flex',
    margin: '15px'
  }
}));

DetailsField.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}