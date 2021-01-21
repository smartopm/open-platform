/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { propAccessor } from '../../utils/helpers';
import ListHeader from './ListHeader';

export default function DataList({ keys, data }) {
  if (keys.length !== Object.keys(data[0]).length) {
    throw new Error('headers must have same length as number of columns in the data prop');
  }
  const classes = useStyles();
  return (
    <>
      <ListHeader headers={keys} />
      {data.map((item, index) => (
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
          className={classes.list}
          key={index}
        >
          <CellData propNames={keys} className={classes.typography} dataObj={item} />
        </Grid>
      ))}
    </>
  );
}

export function CellData({ propNames, dataObj, className }) {
  return propNames.map(prop => (
    <Typography className={className} key={prop} component="div">
      {propAccessor(dataObj, prop)}
    </Typography>
  ));
}

DataList.propTypes = {
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
