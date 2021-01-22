/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-array-index-key */
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
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
          justify="space-between"
          alignItems="center"
          className={classes.list}
          key={index}
          spacing={1}
        >
          <CellData propNames={keys} dataObj={item} />
        </Grid>
      ))}
    </>
  );
}

export function CellData({ propNames, dataObj }) {
  return propNames.map(prop => (
    <Fragment key={prop.title}>{propAccessor(dataObj, prop.title)}</Fragment>
  ));
}

DataList.propTypes = {
  keys: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

CellData.propTypes = {
  propNames: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataObj: PropTypes.object.isRequired
};

const useStyles = makeStyles(() => ({
  // TODO: use colors from the theme
  list: {
    backgroundColor: '#FFFFFF',
    padding: '15px 0',
    border: '1px solid #ECECEC',
    marginBottom: '10px'
  }
}));
