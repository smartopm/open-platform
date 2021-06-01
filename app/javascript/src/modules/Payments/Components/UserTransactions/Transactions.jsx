/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useLazyQuery } from 'react-apollo'
import { CSVLink } from "react-csv";
import Fab from '@material-ui/core/Fab';
import { Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types'
import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { formatError, useParamsQuery } from '../../../../utils/helpers'
import { Spinner } from '../../../../shared/Loading'
import CenteredContent from '../../../../components/CenteredContent'
import Paginate from '../../../../components/Paginate'
import { currencies } from '../../../../utils/constants'
import UserTransactionsList from './UserTransactions'
import DepositQuery from '../../graphql/payment_query'
import ListHeader from '../../../../shared/list/ListHeader';
import Balance from './UserBalance'
import { UserBalance } from '../../../../graphql/queries'

export default function TransactionsList({ userId, user, userData, tab }) {
  const path = useParamsQuery()
  const limit = 10
  const page = path.get('page')
  // const tab = path.get('tab')
  const [offset, setOffset] = useState(Number(page) || 0)
  const theme = useTheme();
  const { t } = useTranslation('common')
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const classes = useStyles();

  const [loadTransactions, { loading, error, data, refetch }] = useLazyQuery(DepositQuery, {
    variables: { userId, limit, offset },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

  const [ loadBalance, { loading: balanceLoad, error: balanceError, data: balanceData, refetch: balanceRefetch }] = useLazyQuery(UserBalance, {
    variables: { userId },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

  const [loadCsvData, { loading: csvLoad, error: csvError, data: csvData, refetch: csvRefetch }] = useLazyQuery(DepositQuery, {
    variables: { userId },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

  const transactionHeader = [
    { title: 'Date', value: t('common:table_headers.date'), col: 1 },
    { title: 'Recorded by', value: t('common:table_headers.recorded_by'), col: 1 },
    { title: 'Payment Type', value: t('common:table_headers.payment_type'), col: 2 },
    { title: 'Amount Paid', value: t('common:table_headers.amount_paid'), col: 1 },
    { title: 'Menu', value: t('common:table_headers.menu'), col: 1 }
  ];

  const csvHeaders = [
    { label: "Created Date", key: "createdAt" },
    { label: "Recorded By", key: "depositor.name" },
    { label: "Payment Type", key: "source" },
    { label: "Amount", key: "allocatedAmount" },
    { label: "Unallocated Amount", key: "unallocatedAmount" },
    { label: "Status", key: "status" },
    { label: "User Name", key: "user.name" },
    { label: "Email", key: "user.email" },
    { label: "Phone Number", key: "user.phoneNumber" },
    { label: "Transaction Number", key: "transactionNumber" },
    { label: "External Id", key: "user.extRefId" }
  ];

  const currency = currencies[user.community.currency] || ''
  const { locale } = user.community
  const currencyData = { currency, locale }

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return
      setOffset(offset - limit)
    } else if (action === 'next') {
      setOffset(offset + limit)
    }
  }

  useEffect(() => {
    if (tab === 'Payments') {
      loadTransactions()
      loadBalance()
      loadCsvData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  if (error && !data) return <CenteredContent>{formatError(error.message)}</CenteredContent>
  if (balanceError && !balanceData) return <CenteredContent>{formatError(balanceError.message)}</CenteredContent>
  if (csvError && !csvData) return <CenteredContent>{formatError(csvError.message)}</CenteredContent>

  return (
    <div>
      {balanceLoad ? <Spinner /> : (
        <Balance 
          user={user}
          userId={userId}
          userData={userData}
          refetch={refetch}
          balanceData={balanceData?.userBalance}
          balanceRefetch={balanceRefetch}
          csvRefetch={csvRefetch}
        />
      )}
      {loading || csvLoad ? <Spinner /> : (
        data?.userTransactions?.length > 0 ? (
          <div className={classes.paymentList}>
            <Fab color="primary" variant="extended" className={classes.download}>
              <CSVLink 
                data={csvData?.userTransactions} 
                style={{color: 'white'}} 
                headers={csvHeaders} 
                filename="transaction-data.csv" 
              >
                Download CSV
              </CSVLink>
            </Fab>
            <div>
              <Typography className={classes.payment} data-testid='header'>Transactions</Typography>
              {matches && <ListHeader headers={transactionHeader} color />}
            </div>
            {
              data.userTransactions.map((trans) => (
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
            }
          </div>
        ) : (
          <CenteredContent>No Transaction Available</CenteredContent>
        )
      )}
      <CenteredContent>
        <Paginate
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={paginate}
          count={data?.userTransactions?.length}
        />
      </CenteredContent>
    </div>
  )
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
  }
});

TransactionsList.defaultProps = {
  userData: {}
}

TransactionsList.propTypes = {
  userId: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  userData: PropTypes.object,
  user: PropTypes.shape({
    id: PropTypes.string,
    userType: PropTypes.string,
    community: PropTypes.shape({
      imageUrl: PropTypes.string,
      name: PropTypes.string,
      currency: PropTypes.string,
      locale: PropTypes.string
    }).isRequired
  }).isRequired
}
