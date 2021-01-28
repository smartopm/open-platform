/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable */
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { propAccessor } from '../../utils/helpers';
import ListHeader from './ListHeader';

export default function DataList({ keys, data, hasHeader, clickable, handleClick }) {
  if (hasHeader && keys.length !== Object.keys(data[0]).length) {
    throw new Error(
      'headers must have same length as number of columns in the data prop or set hasHeader to false'
    );
  }
  const classes = useStyles();
  return (
    <>
      {hasHeader && <ListHeader headers={keys} />}
      {data.map((item, index) => (
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={clickable?.status ? classes.clickable : classes.list}
          onClick={() => handleClick(index) || null}
          key={item.id || index}
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
    <Fragment
      key={prop.title} 
    >
      {propAccessor(dataObj, prop.title)}
    </Fragment>
  ));
}

DataList.defaultProps = {
  hasHeader: true,
  clickable: {
    status: false,
    onclick: null
  }
};

DataList.propTypes = {
  /**
   * @param {object} keys used to know which property to pick from the given object,
   * this also contains number of columns it should occupy
   * headers title must match the properties in the object to be rendered e.g: RenderTaskData.js
   */
  keys: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   *  @param {object} data is the list that is to be rendered, it has to be an array of object,
   * this is then passed to CellData component
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * @param {boolean} hasHeader this determines whether the list should have header,
   * it also verifies if the number of given columns is the same as that of the headers
   */
  hasHeader: PropTypes.bool,
  /**
   * @param {object} clickable used to set the card clickable,
   * it also includes the onClick function when the card is being clicked
   */
  clickable: PropTypes.shape({
    status: PropTypes.bool,
    handelClick: PropTypes.func
  })
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
  },
  clickable: {
    backgroundColor: '#FFFFFF',
    padding: '15px 0',
    border: '1px solid #ECECEC',
    cursor: 'pointer',
    textAlign: 'center'
  }
}));
