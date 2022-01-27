import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Card from '../../../shared/Card';

export default function TaskDetailAccordion({ icon, title, styles, component, openDetails }) {
  const classes = useStyles();
  const [showComponent, setShowComponent] = useState(false)

  useEffect(() => {
    if (openDetails) {
      setShowComponent(true)
    }
  }, [openDetails])

  return (
    <>
      <Card primaryColor styles={styles}>
        <Grid container alignItems="center" justifyContent="center">
          <Grid item sm={2} xs={2}>
            {icon}
          </Grid>
          <Grid item sm={9} xs={8}>
            <Typography color='primary' variant='subtitle2' className={classes.typography}>{title}</Typography>
          </Grid>
          <Grid item sm={1} xs={2}>
            <Grid container>
              <Divider orientation="vertical" flexItem className={classes.divider} color='primary' />
              <Grid item sm={12} xs={12} className={classes.icon}>
                <IconButton color='primary' onClick={() => setShowComponent(!showComponent)}>
                  {showComponent ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </Grid>
            </Grid>
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

const useStyles = makeStyles((theme) => ({
  typography: {
    fontWeight: 400
  },
  divider: {
    margin: '-4.25rem 0',
    backgroundColor: theme.palette.primary.main
  },
  icon: {
    textAlign: 'right'
  }
}));

TaskDetailAccordion.defaultProps = {
  styles: {},
  openDetails: false
}

TaskDetailAccordion.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.object,
  component: PropTypes.node.isRequired,
  openDetails: PropTypes.bool
};
