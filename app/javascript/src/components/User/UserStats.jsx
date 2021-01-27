// This component will house the customer journey dashboard
import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useQuery } from 'react-apollo';
import { SubStatusQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import { StatusList } from '../../shared/Status';
import { userSubStatus } from '../../utils/constants';

export default function UserStats() {
  const { loading, data, error } = useQuery(SubStatusQuery);
  const classes = useStyles();
  return (
    <>
      <div className={classes.statusSection}>
        <div className={classes.titleSection}>
          <h5 className={classes.title}>Substatus</h5>
        </div>
        {error && error.message}
        {loading ? (
          <Spinner />
        ) : (
          <StatusList data={data?.substatusQuery} statuses={userSubStatus} />
        )}
      </div>
    </>
  );
}

const useStyles = makeStyles({
  statusSection: {
    width: '40%',
    margin: '6%'
  },
  titleSection: {
    color: '#66A59A',
    borderBottom: '1px #66A59A solid',
    backgroundColor: '#FAFFFE',
    height: 50
  },
  title: {
    padding: 10
  }
});
