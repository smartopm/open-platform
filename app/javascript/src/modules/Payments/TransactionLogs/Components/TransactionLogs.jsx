/* eslint-disable complexity */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLazyQuery } from 'react-apollo';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import PageWrapper from '../../../../shared/PageWrapper';
import { TransactionLogsQuery, UserTransactionLogsQuery } from '../graphql/transaction_logs_query';
import { Spinner } from '../../../../shared/Loading';
import { dateToString } from '../../../../components/DateContainer';
import CenteredContent from '../../../../shared/CenteredContent';
import Paginate from '../../../../components/Paginate';
import { useParamsQuery } from '../../../../utils/helpers';

export default function TransactionLogs() {
  const { t } = useTranslation('common');
  const history = useHistory();
  const matches = useMediaQuery('(max-width:600px)');
  const path = useParamsQuery('');
  const classes = useStyles();
  const [offset, setOffset] = useState(0);
  const [userId, setUserId] = useState(0);
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
    variables: { offset, limit, userId },
    fetchPolicy: 'cache-and-network',
  });
  const breadCrumbObj = {
    linkText: t('menu.payment_plural'),
    linkHref: '/payments/pay',
    pageName: t('misc.history'),
  };

  const transactionLogs = data?.transactionLogs || userLogData?.userTransactionLogs;

  function handleMoreDetailsClick(id) {
    if (currentId && currentId !== id && openDetails) {
      return;
    }
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

  const rightPanelObj = [
    {
      mainElement: (
        <Button style={{ color: '#FFFFFF' }} variant="contained" onClick={() => history.push('/payments/pay')}>
          {matches ? <AddIcon /> : t('common:misc.add_payment')}
        </Button>
      ),
      key: 1,
    },
  ];

  useEffect(() => {
    const getUserId = path.get('userId');
    setUserId(getUserId);
    if (getUserId) {
      getUserLogs();
    }
    if (!getUserId) {
      getAllLogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <PageWrapper
      pageTitle={t('misc.history')}
      breadCrumbObj={breadCrumbObj}
      rightPanelObj={userId ? rightPanelObj : undefined}
      oneCol
    >
      {(error || userLogError) && (
        <CenteredContent>
          <p>{error.message || userLogError.message}</p>
        </CenteredContent>
      )}
      {loading || userLogsLoading ? (
        <Spinner />
      ) : data?.transactionLogs.length > 0 || userLogData?.userTransactionLogs.length > 0 ? (
        <>
          {transactionLogs.map(trans => (
            <Grid
              container
              key={trans.id}
              className={classes.container}
              alignItems="center"
              data-testid="container"
            >
              <Grid
                item
                md={userId ? 7 : 3}
                lg={userId ? 7 : 3}
                xs={userId ? 6 : 10}
                sm={userId ? 7 : 3}
              >
                <Typography
                  variant="h6"
                  data-testid="amount"
                >
                  {`${trans.currency} ${trans.paidAmount}`}
                </Typography>
              </Grid>
              {!userId && matches && (
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
              {!userId && (
                <Grid item md={5} lg={5} sm={5} xs={6}>
                  <Typography variant="subtitle1">{trans.accountName}</Typography>
                </Grid>
              )}
              <Grid item md={3} lg={3} sm={3} xs={userId ? 4 : 6} style={{ textAlign: 'right' }}>
                <Typography variant="subtitle1">{dateToString(trans.createdAt)}</Typography>
              </Grid>
              {(!matches || (userId && matches)) && (
                <Grid
                  item
                  md={!userId ? 1 : 2}
                  lg={!userId ? 1 : 2}
                  sm={!userId ? 1 : 2}
                  xs={2}
                  style={{ textAlign: 'right' }}
                >
                  <IconButton onClick={() => handleMoreDetailsClick(trans.id)} data-testid="icon">
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
                  <Grid
                    item
                    md={12}
                    lg={12}
                    sm={12}
                    xs={12}
                    style={{ paddingTop: '16px' }}
                    data-testid="invoice"
                  >
                    <Typography variant="subtitle1" color="text.secondary">
                      {`${t('menu.invoice')}# ${trans.invoiceNumber}`}
                    </Typography>
                  </Grid>
                  <Grid item md={12} lg={12} sm={12} xs={12} data-testid="transaction">
                    <Typography variant="subtitle1" color="text.secondary">
                      {`${t('misc.id')}# ${trans.transactionId}`}
                    </Typography>
                  </Grid>
                  <Grid item md={12} lg={12} sm={12} xs={12}>
                    <Typography variant="subtitle1" color="text.secondary">
                      {`${t('misc.references')}# ${trans.transactionRef}`}
                    </Typography>
                  </Grid>
                  {!userId && (
                    <Grid item md={12} lg={12} sm={12} xs={12}>
                      <Typography variant="subtitle1" color="text.secondary">
                        {`${t('misc.form_amount')} ${trans.currency}${trans.amount}`}
                      </Typography>
                    </Grid>
                  )}
                  {trans.description && (
                    <Grid item style={{ paddingTop: '16px' }} data-testid="description">
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
