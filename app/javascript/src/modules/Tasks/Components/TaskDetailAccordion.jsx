import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function TaskDetailAccordion({ title, component, openDetails }) {
  const classes = useStyles();
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    if (openDetails) {
      setShowComponent(true);
    } else {
      setShowComponent(false);
    }
  }, [openDetails]);

  return (
    <>
      <Grid onClick={() => setShowComponent(!showComponent)} className={classes.container}>
        <Divider />
        <Grid container className={classes.body} data-testid="body">
          <Grid item sm={11} xs={10}>
            <Typography
              data-testid="title"
              variant="subtitle2"
              className={classes.typography}
            >
              {title}
            </Typography>
          </Grid>
      
          <Grid item sm={1} xs={2} style={showComponent ? { backgroundColor: '#EEF6F9' } : undefined} className={classes.icon}>
            <Grid container>
              <Divider orientation="vertical" flexItem />
              <Grid item sm={11}>
                <IconButton data-testid="toggle-icon" size="large">
                  {showComponent ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
      </Grid>
      {showComponent && <div data-testid="component" className={classes.component}>{component}</div>}
    </>
);
}

const useStyles = makeStyles(() => ({
  typography: {
    fontWeight: 400
  },
  icon: {
    textAlign: 'center'
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    cursor: 'pointer'
  },
  component: {
    marginTop: '10px'
  }
}));

TaskDetailAccordion.defaultProps = {
  openDetails: false
};

TaskDetailAccordion.propTypes = {
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  component: PropTypes.node.isRequired,
  openDetails: PropTypes.bool
};
