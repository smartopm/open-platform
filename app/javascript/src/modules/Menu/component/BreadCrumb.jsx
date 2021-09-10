import React from 'react';
import { Breadcrumbs, Typography, Link } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { toTitleCase, capitalize } from '../../../utils/helpers';

export default function BreadCrumb({ data }) {
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
      style={{ width: '70%' }}
      separator={<NavigateNextIcon fontSize="small" />}
    >
      {console.log(breadCrumbs)}
      {data?.length > 0 && (
        <Link color="primary" href="/" onClick={() => {}}>
          Home
        </Link>
      )}
      {data?.length > 1 && (
        <Link
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
      <Typography color="textPrimary">
        {toTitleCase(breadCrumbs[breadCrumbs.length - 1])}
      </Typography>
    </Breadcrumbs>
  );
}
