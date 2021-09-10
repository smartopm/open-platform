import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Breadcrumbs, Typography, Link } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { toTitleCase, capitalize } from '../../../utils/helpers';

export default function BreadCrumb({ data }) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
  const breadCrumbs = data?.filter(
    val =>
      !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(val)
  );
  const uuid = data?.filter(val =>
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(val)
  );

  function modifyString(str) {
    if (str === 'users') return 'User';
    if (str === 'tasks') return 'Task';
    return capitalize(str);
  }

  function modifyUrl(str) {
    if (str === 'users') return 'user';
    if (str === 'tasks') return 'task';
    return str;
  }

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      className={classes.body}
      style={matches ? {marginLeft: '-25px'} : {}}
      separator={<NavigateNextIcon fontSize="small" color="primary" />}
    >
      {data?.length > 0 && (
        <Link color="primary" href="/" style={{fontSize: '12px'}}>
          Home
        </Link>
      )}
      {data?.length > 1 && (
        <Link
          style={{fontSize: '12px'}}
          color="primary"
          href={
            data?.length > 2 && uuid.length
              ? `/${breadCrumbs[0]}/${uuid[0]}`
              : `/${modifyUrl(breadCrumbs[0])}s`
          }
          onClick={() => {}}
        >
          {data?.length > 2 && uuid.length
            ? capitalize(breadCrumbs[0])
            : `${modifyString(breadCrumbs[0])}s`}
        </Link>
      )}
      <Typography color="textPrimary" variant='caption'>
        {toTitleCase(breadCrumbs[breadCrumbs.length - 1])}
      </Typography>
    </Breadcrumbs>
  );
}

const useStyles = makeStyles(() => ({
  body: {
    width: '70%',
    paddingBootom: '10px',
    marginTop: '-10px'
  }
}));

BreadCrumb.defaultProps = {
  data: []
};

BreadCrumb.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string)
};
