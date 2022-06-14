// This component will house the customer journey dashboard
import React from 'react';
import { useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useQuery } from 'react-apollo';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useHistory } from 'react-router-dom';
import { SubStatusQuery, SubStatusDistributionReportQuery } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';
import { StatusList } from '../../../shared/Status';
import { userSubStatus } from '../../../utils/constants';
import SubStatusTimeDistributionReport from './SubStatusTimeDistributionReport';
import PageWrapper from '../../../shared/PageWrapper';

export default function UserStats() {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const { loading, data, error } = useQuery(SubStatusQuery);
  const { data: subStatusDistributionData } = useQuery(SubStatusDistributionReportQuery);
  const subStatus = {residents_count: 'Residents', ...userSubStatus};

  function handleFilter(query) {
    history.push({pathname: '/users', state: { query }})
  }

  return (
    <PageWrapper>
      <div className={matches ? classes.statusSection : undefined}>
        <div className={classes.titleSection}>
          <h5 className={classes.title}>Customer Journey Stage</h5>
        </div>
        {error && error.message}
        {loading ? (
          <Spinner />
        ) : (
          <StatusList
            data={data?.substatusQuery || {}}
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
    </PageWrapper>
  );
}

const useStyles = makeStyles(theme => ({
  statusSection: {
    width: '40%',
    marginBottom: '6%'
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
