import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Card from '../../../shared/Card';

export default function TaskDetailAccordion({ icon, title, styles, component }) {
  const classes = useStyles();
  const [showComponent, setShowComponent] = useState(false)

  return (
    <>
      <Card primaryColor styles={styles}>
        <Grid container alignItems="center" justifyContent="center">
          <Grid item sm={2}>
            {icon}
          </Grid>
          <Grid item sm={8}>
            <Typography color='primary' variant='subtitle2' className={classes.typography}>{title}</Typography>
          </Grid>
          <Grid item sm={2} className={classes.icon}>
            <IconButton color='primary' onClick={() => setShowComponent(!showComponent)}>
              {showComponent ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Grid>
        </Grid>
      </Card>
      {showComponent && (
        <>
          {component}
        </>
      )}
    </>
  );
}

const useStyles = makeStyles(() => ({
  icon: {
    textAlign: 'right'
  },
  typography: {
    fontWeight: 400
  }
}));
