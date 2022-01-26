import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
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
          <Grid item sm={9}>
            <Typography color='primary' variant='subtitle2' className={classes.typography}>{title}</Typography>
          </Grid>
          <Grid item sm={1}>
            <Grid container>
              <Divider orientation="vertical" flexItem className={classes.divider} color='primary' />
              <Grid item>
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
    margin: '-20px 0',
    backgroundColor: theme.palette.primary.main
  }
}));

TaskDetailAccordion.defaultProps = {
  styles: {}
}

TaskDetailAccordion.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.object,
  component: PropTypes.node.isRequired
};
