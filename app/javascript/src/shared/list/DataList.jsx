/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-array-index-key */
import React, { Fragment } from 'react';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import { objectAccessor } from '../../utils/helpers';
import ListHeader from './ListHeader';
import CenteredContent from '../../components/CenteredContent';

/**
 * @deprecated
 */
export default function DataList({ keys, data, hasHeader, clickable, handleClick, color, defaultView }) {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  if (hasHeader && keys.length !== Object.keys(data[0]).length) {
    throw new Error(
      'headers must have same length as number of columns in the data prop or set hasHeader to false'
    );
  }
  if (!data.length) {
    return <CenteredContent>No Data</CenteredContent>;
  }
  return (
    <>
      {
      matches && defaultView ? (
        <div>
          {data.map((item, index) => (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              key={item.id || index}
              style={{display: 'flex'}}
              className={clickable ? classes.clickable : classes.list}
              onClick={clickable ? () => handleClick(item) : null}
            >
              <div style={{marginRight: '10px', width: '50%'}}>
                <MobileCellData propNames={keys.slice(0, 2)} dataObj={item} />
                <MobileCellData propNames={keys} dataObj={item} singlePropName={{status: true, value: 'Status'}} />
              </div>
              <div style={{marginRight: '3px', width: '40%'}}>
                <MobileCellData propNames={keys.slice(2, keys.length)} dataObj={item} />
              </div>
              <div>
                <MobileCellData propNames={keys} dataObj={item} singlePropName={{status: true, value: 'Menu'}} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {hasHeader && <ListHeader headers={keys} />}
          {data.map((item, index) => {
            return (
              <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                className={clickable ? classes.clickable : classes.list}
                onClick={clickable ? () => handleClick(item) : null}
                key={item.id || index}
                spacing={1}
                style={color ? {backgroundColor: '#FDFDFD'} : {marginBottom: '7px'}}
              >
                <CellData propNames={keys} dataObj={item} />
              </Grid>
            );})}
        </div>
      )
}
    </>
);
}

export function CellData({ propNames, dataObj }) {
  return propNames.map(prop => (
    <Fragment
      key={prop.title}
    >
      {objectAccessor(dataObj, prop.title)}
    </Fragment>
  ));
}

export function MobileCellData({ propNames, dataObj, singlePropName }) {
  let names = propNames.filter(prop => prop.title !== 'Status' && prop.title !== 'Menu')
  if (singlePropName?.status) {
    names = propNames.filter(prop => prop.title === singlePropName.value)
  }

  return names.map(prop => (
    <Fragment
      key={prop.title}
    >
      <div style={{margin: '20px 10px', ...prop.style}}>
        {!singlePropName && <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{prop.title}</div>}
        {objectAccessor(dataObj, prop.title)}
      </div>
    </Fragment>
  ));
}

DataList.defaultProps = {
  hasHeader: true,
  clickable: false,
  handleClick: () => {},
  color: false,
  defaultView: true
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
  clickable: PropTypes.bool,
  handleClick: PropTypes.func,
  color: PropTypes.bool,
  defaultView: PropTypes.bool
};

CellData.propTypes = {
  propNames: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataObj: PropTypes.object.isRequired
};

MobileCellData.defaultProps = {
  singlePropName: null
}

MobileCellData.propTypes = {
  propNames: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataObj: PropTypes.object.isRequired,
  singlePropName: PropTypes.object
};

const useStyles = makeStyles(() => ({
  // TODO: use colors from the theme
  list: {
    backgroundColor: '#FFFFFF',
    padding: '10px 0',
    border: '1px solid #ECECEC',
    width: '100%',
    marginLeft: '0.5px'
  },
  clickable: {
    backgroundColor: '#FFFFFF',
    padding: '10px 0',
    border: '1px solid #ECECEC',
    cursor: 'pointer',
    width: '100%',
    marginLeft: '0.5px'
  }
}));
