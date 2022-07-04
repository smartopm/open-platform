import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useLazyQuery } from 'react-apollo';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import PageWrapper from '../../../../shared/PageWrapper';
import { TransactionLogsQuery, UserTransactionLogsQuery } from '../graphql/transaction_logs_query';
import { Spinner } from '../../../../shared/Loading';
import { dateToString } from '../../../../components/DateContainer';
import CenteredContent from '../../../../shared/CenteredContent';
import Paginate from '../../../../components/Paginate';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';

export default function TransactionLogs() {
  const { t } = useTranslation('common');
  const matches = useMediaQuery('(max-width:600px)');
  const authState = useContext(AuthStateContext);
  const admin = authState?.user.userType === 'admin';
  const classes = useStyles();
  const [offset, setOffset] = useState(0);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const limit = 10;
  const [getAllLogs, { data, error, loading }] = useLazyQuery(TransactionLogsQuery, {
    variables: { offset, limit },
    fetchPolicy: 'cache-and-network',
  });
  const [
    getUserLogs,
    { loading: userLogsLoading, data: userLogData, error: userLogError },
  ] = useLazyQuery(UserTransactionLogsQuery, {
    variables: { offset, limit, userId: authState?.user.id },
    fetchPolicy: 'cache-and-network',
  });
  const breadCrumbObj = {
    linkText: t('menu.payment_plural'),
    linkHref: '/payments/pay',
    pageName: t('misc.history'),
  };

  function handleMoreDetailsClick(id) {
    setCurrentId(id);
    setOpenDetails(!openDetails);
  }

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return;
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }

  useEffect(() => {
    if (!admin) {
      getUserLogs();
    }
    if (admin) {
      getAllLogs();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper pageTitle={t('misc.history')} breadCrumbObj={breadCrumbObj} oneCol>
      {console.log(authState?.user.id)}
      {console.log(userLogData)}
      {(error || userLogError) && (
        <CenteredContent>
          <p>{error.message || userLogError.message}</p>
        </CenteredContent>
      )}
      {(loading || userLogsLoading) ? (
        <Spinner />
      ) : data?.transactionLogs.length > 0 ? (
        <>
          {data.transactionLogs.map(trans => (
            <Grid container key={trans.id} className={classes.container} alignItems="center">
              <Grid item md={!admin ? 7 : 3} lg={!admin ? 7 : 3} xs={10} sm={!admin ? 6 : 3}>
                <Typography variant="h6">{`${trans.currency} ${trans.paidAmount}`}</Typography>
              </Grid>
              {matches && (
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <IconButton onClick={() => handleMoreDetailsClick(trans.id)}>
                    {openDetails && currentId === trans.id ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                </Grid>
              )}
              {admin && (
                <Grid item md={5} lg={5} sm={5} xs={6}>
                  <Typography variant="subtitle1">{trans.accountName}</Typography>
                </Grid>
              )}
              <Grid item md={3} lg={3} sm={3} xs={6} style={{ textAlign: 'right' }}>
                <Typography variant="subtitle1">{dateToString(trans.createdAt)}</Typography>
              </Grid>
              {!matches && (
                <Grid item md={1} lg={1} sm={1} style={{ textAlign: 'right' }}>
                  <IconButton onClick={() => handleMoreDetailsClick(trans.id)}>
                    {openDetails && currentId === trans.id ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                </Grid>
              )}
              {openDetails && currentId === trans.id && (
                <>
                  <Grid item md={12} lg={12} sm={12} xs={12} style={{ paddingTop: '16px' }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      {`${t('menu.invoice')}# ${trans.invoiceNumber}`}
                    </Typography>
                  </Grid>
                  <Grid item md={12} lg={12} sm={12} xs={12}>
                    <Typography variant="subtitle1" color="text.secondary">
                      {`${t('misc.id')}# ${trans.transactionId}`}
                    </Typography>
                  </Grid>
                  <Grid item md={12} lg={12} sm={12} xs={12}>
                    <Typography variant="subtitle1" color="text.secondary">
                      {`${t('misc.references')}# ${trans.transactionRef}`}
                    </Typography>
                  </Grid>
                  <Grid item md={12} lg={12} sm={12} xs={12}>
                    <Typography variant="subtitle1" color="text.secondary">
                      {`${t('misc.form_amount')} ${trans.currency}${trans.amount}`}
                    </Typography>
                  </Grid>
                  {trans.description && (
                    <Grid item style={{ paddingTop: '16px' }}>
                      <Typography variant="subtitle1" md={12} lg={12} sm={12} xs={12}>
                        {trans.description}
                      </Typography>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          ))}
          {data?.transactionLogs.length > 9 && (
            <CenteredContent>
              <Paginate
                offSet={offset}
                limit={limit}
                active={offset >= 1}
                count={data?.transactionLogs.length}
                handlePageChange={paginate}
              />
            </CenteredContent>
          )}
        </>
      ) : (
        <CenteredContent>{t('misc.no_history')}</CenteredContent>
      )}
    </PageWrapper>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    padding: '10px',
    border: '1px solid #E0E0E0',
    borderRadius: '4px',
    marginBottom: '16px',
  },
}));
