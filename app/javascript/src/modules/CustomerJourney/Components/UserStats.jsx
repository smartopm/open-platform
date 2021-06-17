// This component will house the customer journey dashboard
import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useQuery } from 'react-apollo';
import { useHistory } from 'react-router-dom';
import { SubStatusQuery, SubStatusDistributionReportQuery } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';
import { StatusList } from '../../../shared/Status';
import { userSubStatus } from '../../../utils/constants';
import SubStatusTimeDistributionReport from './SubStatusTimeDistributionReport';

export default function UserStats() {
  const classes = useStyles();
  const history = useHistory();
  const { loading, data, error } = useQuery(SubStatusQuery);
  const { data: subStatusDistributionData } = useQuery(SubStatusDistributionReportQuery);
  const subStatus = {...userSubStatus, residents_count: 'Residents'};

  function handleFilter(query) {
    history.push({pathname: '/users', state: { query }})
  }

  return (
    <>
      <div className={classes.statusSection}>
        <div className={classes.titleSection}>
          <h5 className={classes.title}>Customer Journey Stage</h5>
        </div>
        {error && error.message}
        {loading ? (
          <Spinner />
        ) : (
          <StatusList 
            data={data?.substatusQuery} 
            statuses={subStatus}
            handleFilter={handleFilter} 
          />
        )}
      </div>
      {subStatusDistributionData && (
        <SubStatusTimeDistributionReport 
          userSubStatus={userSubStatus} 
          subStatusDistributionData={subStatusDistributionData}
        />
)}
    </>
  );
}

const useStyles = makeStyles(theme => ({
  statusSection: {
    width: '40%',
    margin: '6%'
  },
  titleSection: {
    // color: theme.palette.primary.main,
    borderBottom: `1px ${theme.palette.primary.main} solid`,
    backgroundColor: theme.palette.primary.light,
    height: 50
  },
  title: {
    padding: 10
  }
}));
