import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function TaskDetailAccordion({ title, component, openDetails, addButton }) {
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
          <Grid item md={addButton ? 8 : 11} sm={addButton ? 7 : 11} xs={addButton ? 5 : 10}>
            <Typography
              data-testid="title"
              variant="subtitle2"
              className={classes.typography}
            >
              {title}
            </Typography>
          </Grid>
          {addButton && (
            <Grid item md={3} sm={4} xs={5} style={{textAlign: 'right', paddingRight: '20px'}}>
              {addButton}
            </Grid>
          )}
          <Grid item md={1} sm={1} xs={2}>
            <Grid container alignItems='center' justifyContent='center'>
              <Divider orientation="vertical" flexItem />
              <Grid item md={11} xs={8} sm={8}>
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
  openDetails: false,
  addButton: null
};

TaskDetailAccordion.propTypes = {
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  component: PropTypes.node.isRequired,
  openDetails: PropTypes.bool,
  addButton: PropTypes.node
};
