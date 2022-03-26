import React from 'react'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Image from '../../../assets/images/empty-folder.svg'

export default function EmptyCard({ title, subtitle}) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)')
  return (
    <Grid container>
      <Grid item xs={12} style={matches ? {padding: '0 20px'} : {padding: '0 79px'}}>
        <Paper className={classes.paper}>
          <div>
            <img src={Image} width='100' height='100' alt='empty-folder' style={{background: '#F9F9F9', padding: '30px', borderRadius: '40px', marginBottom: '15px'}} />
          </div>
          <Typography color="textPrimary" variant='body1' gutterBottom>
            {title}
          </Typography>
          <Typography color="textSecondary" variant='body2' gutterBottom>
            {subtitle}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles(() => ({
  paper: {
    textAlign: 'center',
    padding: '25px',
    width: '99%',
    marginBottom: '20px'
  }
}));

EmptyCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired
};