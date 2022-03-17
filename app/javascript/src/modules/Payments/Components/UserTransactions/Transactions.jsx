/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLazyQuery } from 'react-apollo';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CenteredContent from '../../../../components/CenteredContent';
import Paginate from '../../../../components/Paginate';
import { currencies } from '../../../../utils/constants';
import UserTransactionsList from './UserTransactions';
import ListHeader from '../../../../shared/list/ListHeader';
import ButtonComponent from '../../../../shared/buttons/Button';
import { useParamsQuery, formatError, objectAccessor } from '../../../../utils/helpers';
import { dateToString } from '../../../../components/DateContainer';
import Transactions from '../../graphql/payment_query';
import { Spinner } from '../../../../shared/Loading';
import useDebounce from '../../../../utils/useDebounce';

export default function TransactionsList({
  userId,
  user,
  userData,
  transData,
  refetch,
  balanceRefetch,
  planData,
  setFiltering,
  filtering
}) {
  const path = useParamsQuery();
  const history = useHistory();
  const limit = 10;
  const page = path.get('page');
  const planId = path.get('id');
  const [offset, setOffset] = useState(Number(page) || 0);
  const [filterValue, setFilterValue] = useState('all');
  const debouncedValue = useDebounce(filterValue, 100);
  const theme = useTheme();
  const { t } = useTranslation(['payment', 'common']);
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const classes = useStyles();

  const transactionHeader = [
    { title: 'Date', value: t('common:table_headers.date'), col: 1 },
    { title: 'Recorded by', value: t('common:table_headers.recorded_by'), col: 1 },
    { title: 'Payment Type', value: t('common:table_headers.payment_type'), col: 2 },
    { title: 'Amount Paid', value: t('common:table_headers.amount_paid'), col: 1 },
    { title: 'Menu', value: t('common:table_headers.menu'), col: 1 }
  ];

  const currency = objectAccessor(currencies, user.community.currency) || '';
  const { locale } = user.community;
  const currencyData = { currency, locale };

  const [loadPlanTransactions, { loading, error, data, refetch: transRefetch }] = useLazyQuery(Transactions, {
    variables: { userId, planId: debouncedValue, limit, offset },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return;
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }

  function handleSelecMenu(event) {
    setFilterValue(event.target.value);
    setFiltering(true);
    loadPlanTransactions();
  }

  useEffect(() => {
    if (planId) {
      setFilterValue(planId);
      setFiltering(true);
      loadPlanTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error && !data) return <CenteredContent>{formatError(error.message)}</CenteredContent>;

  return (
    <div>
      {filtering && loading ? (
        <Spinner />
      ) : data?.userTransactions?.length > 0 || transData?.userTransactions?.length > 0 ? (
        <div className={classes.paymentList}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}
          >
            <Typography className={classes.payment} data-testid="header">
              {t('common:menu.transaction_plural')}
            </Typography>
            <ButtonComponent
              variant={matches ? 'outlined' : 'text'}
              color="primary"
              buttonText={t('actions.view_all_plans')}
              handleClick={() => history.push('?tab=Plans')}
              size="small"
            />
          </div>
          <div style={{ display: 'flex', margin: '-20px 0 10px 0' }}>
            <Typography className={classes.display} data-testid="header">
              {t('misc.displaying_result')}
            </Typography>
            <TextField
              color="primary"
              margin="normal"
              id="transaction-filter"
              inputProps={{ 'data-testid': 'transaction-filter' }}
              value={filterValue}
              onChange={event => handleSelecMenu(event)}
              required
              select
            >
              <MenuItem value="all">{t('common:misc.all')}</MenuItem>
              {planData?.map(plan => (
                <MenuItem value={plan.id} key={plan.id}>
                  {plan.status !== 'general' ? dateToString(plan.startDate) : ''}
                  {' '}
                  {plan.status !== 'general' ? plan.landParcel.parcelNumber: 'General Funds'}
                </MenuItem>
              ))}
            </TextField>
          </div>
          {matches && <ListHeader headers={transactionHeader} color />}
          {filtering && Boolean(data?.userTransactions?.length) ? (
            data.userTransactions.map(trans => (
              <div key={trans.id}>
                <UserTransactionsList
                  transaction={trans}
                  currencyData={currencyData}
                  userData={userData}
                  userType={user.userType}
                  refetch={transRefetch}
                  balanceRefetch={balanceRefetch}
                />
              </div>
            ))
          ) : filtering && data?.userTransactions?.length === 0 ? (
            <CenteredContent>{t('errors.no_transaction_available')}</CenteredContent>
          ) : (
            transData.userTransactions.map(trans => (
              <div key={trans.id}>
                <UserTransactionsList
                  transaction={trans}
                  currencyData={currencyData}
                  userData={userData}
                  userType={user.userType}
                  refetch={refetch}
                  balanceRefetch={balanceRefetch}
                />
              </div>
            ))
          )}
        </div>
      ) : (
        <CenteredContent>{t('errors.no_transaction_available')}</CenteredContent>
      )}
      {filtering && Boolean(data?.userTransactions?.length) && (
        <CenteredContent>
          <Paginate
            offSet={offset}
            limit={limit}
            active={offset >= 1}
            handlePageChange={paginate}
            count={transData?.userTransactions?.length}
          />
        </CenteredContent>
      )}
    </div>
  );
}

const useStyles = makeStyles({
  payment: {
    fontWeight: 500,
    fontSize: '20px',
    color: '#313131',
    marginBottom: '30px'
  },
  paymentList: {
    backgroundColor: '#FDFDFD',
    padding: '20px',
    borderRadius: '4px',
    border: '1px solid #EEEEEE',
    marginTop: '20px'
  },
  download: {
    boxShadow: 'none',
    position: 'fixed',
    bottom: 20,
    right: 57,
    marginLeft: '30%',
    zIndex: '1000'
  },
  display: {
    margin: '20px 10px 0 0',
    fontSize: '16px',
    fontWeight: 500,
    color: '#313131'
  }
});

TransactionsList.defaultProps = {
  userData: {},
  transData: {},
  refetch: () => {},
  balanceRefetch: () => {},
  planData: []
};

TransactionsList.propTypes = {
  userData: PropTypes.object,
  transData: PropTypes.object,
  setFiltering: PropTypes.func.isRequired,
  filtering: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    userType: PropTypes.string,
    community: PropTypes.shape({
      imageUrl: PropTypes.string,
      name: PropTypes.string,
      currency: PropTypes.string,
      locale: PropTypes.string
    }).isRequired
  }).isRequired,
  refetch: PropTypes.func,
  userId: PropTypes.string.isRequired,
  balanceRefetch: PropTypes.func,
  planData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      startDate: PropTypes.string,
      landParcel: PropTypes.shape({
        parcelNumber: PropTypes.string
      })
    })
  )
};
