import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

export default function TaskDetailAccordion({ title, component, openDetails }) {
  const classes = useStyles();
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    if (openDetails) {
      setShowComponent(true);
    }
  }, [openDetails]);

  return (
    <>
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
              <IconButton
                onClick={() => setShowComponent(!showComponent)}
                data-testid="toggle-icon"
              >
                {showComponent ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      {showComponent && <div data-testid="component">{component}</div>}
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
    padding: '10px'
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
