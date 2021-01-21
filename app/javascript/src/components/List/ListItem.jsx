/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { propAccessor } from '../../utils/helpers';

export default function ListItem({ keys, data }) {
  //   if (keys.length !== data.length) {
  //     throw new Error('headers must have same lenght as received data');
  //   }
  const classes = useStyles();
  return (
    <>
      {data.map((item, index) => (
        <Grid
          container
          direction="row"
          justify="space-evenly"
          alignItems="center"
          className={classes.list}
          key={index}
        >
          <Typography>Checkbox</Typography>
          <CellData propNames={keys} className={classes.typography} dataObj={item} />
          <Typography>Lonely child</Typography>
        </Grid>
      ))}
    </>
  );
}

export function CellData({ propNames, dataObj, className }) {
  return propNames.map(prop => (
    <Typography className={className} key={prop}>
      {propAccessor(dataObj, prop)}
    </Typography>
  ));
}

ListItem.propTypes = {
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

CellData.propTypes = {
  propNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataObj: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired
};

const useStyles = makeStyles(() => ({
  typography: {
    width: '150px'
  },
  list: {
    backgroundColor: '#FFFFFF',
    padding: '15px 0',
    border: '1px solid #ECECEC',
    marginBottom: '10px'
  }
}));
