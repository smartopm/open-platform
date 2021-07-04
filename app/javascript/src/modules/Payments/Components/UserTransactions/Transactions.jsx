/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import { Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types'
import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CenteredContent from '../../../../components/CenteredContent'
import Paginate from '../../../../components/Paginate'
import { currencies } from '../../../../utils/constants'
import UserTransactionsList from './UserTransactions'
import ListHeader from '../../../../shared/list/ListHeader';
import ButtonComponent from '../../../../shared/buttons/Button'
import { useParamsQuery } from '../../../../utils/helpers'

export default function TransactionsList({ user, userData, transData, refetch }) {
  const path = useParamsQuery()
  const history = useHistory();
  const limit = 10
  const page = path.get('page')
  const [offset, setOffset] = useState(Number(page) || 0)
  const theme = useTheme();
  const { t } = useTranslation('common')
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const classes = useStyles();

  const transactionHeader = [
    { title: 'Date', value: t('common:table_headers.date'), col: 1 },
    { title: 'Recorded by', value: t('common:table_headers.recorded_by'), col: 1 },
    { title: 'Payment Type', value: t('common:table_headers.payment_type'), col: 2 },
    { title: 'Amount Paid', value: t('common:table_headers.amount_paid'), col: 1 },
    { title: 'Menu', value: t('common:table_headers.menu'), col: 1 }
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

  // if (error && !data) return <CenteredContent>{formatError(error.message)}</CenteredContent>

  return (
    <div>
      {transData?.userTransactions?.length > 0 ? (
        <div className={classes.paymentList}>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: '10px' }}>
            <Typography className={classes.payment} data-testid='header'>Transactions</Typography>
            {
                  user.userType === 'admin' && (
                  <ButtonComponent variant='outlined' buttonText="View all Plans" handleClick={() => history.push('?tab=Plans')} />
                  )
                }
          </div>
          {matches && <ListHeader headers={transactionHeader} color />}
          {
            transData.userTransactions.map((trans) => (
              <div key={trans.id}>
                <UserTransactionsList 
                  transaction={trans} 
                  currencyData={currencyData}
                  userData={userData}
                  userType={user.userType}
                  refetch={refetch}
                />
              </div>
            ))
          }
        </div>
        ) : (
          <CenteredContent>No Transaction Available</CenteredContent>
        )}
      <CenteredContent>
        <Paginate
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={paginate}
          count={transData?.userTransactions?.length}
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
  userData: {},
  transData: {}
}

TransactionsList.propTypes = {
  userData: PropTypes.object,
  transData: PropTypes.object,
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
  refetch: PropTypes.func.isRequired
}
