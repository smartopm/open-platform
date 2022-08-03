import React, { useContext, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';
import { Typography, Fab } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatMoney } from '../../../../utils/helpers';
import { currencies } from '../../../../utils/constants';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import PaymentModal from './PaymentModal';

export default function Balance({
  user,
  userId,
  userData,
  refetch,
  balanceData,
  balanceRefetch,
  transRefetch,
  genRefetch
}) {
  const authState = useContext(AuthStateContext);
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation('common');
  const [payOpen, setPayOpen] = useState(false);

  const currency = currencies[user.community.currency] || '';
  const { locale } = user.community;
  const currencyData = { currency, locale };
  const userTransactionPermissions = authState.user?.permissions.find(permissionObject => permissionObject.module === 'payment_records')
  const canCreateTransactions = userTransactionPermissions? userTransactionPermissions.permissions.includes('can_create_transaction'): false

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {Boolean(balanceData?.pendingBalance) && (
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
            <Typography variant={matches ? 'caption' : 'subtitle1'}>
              {t('common:misc.total_balance')}
            </Typography>
            <Typography variant={matches ? 'body2' : 'h5'} color="primary" data-testid="pending-balance">
              {balanceData?.pendingBalance === 0
                ? formatMoney(currencyData, balanceData?.pendingBalance)
                : `- ${formatMoney(currencyData, balanceData?.pendingBalance)}`}
            </Typography>
          </div>
        )}
        {Boolean(balanceData?.totalTransactions) && (
          <div
            style={
              matches
                ? { display: 'flex', flexDirection: 'column', marginLeft: '10px' }
                : { display: 'flex', flexDirection: 'column', marginLeft: '30px' }
            }
          >
            <Typography variant={matches ? 'caption' : 'subtitle1'}>
              {t('common:misc.total_transactions')}
            </Typography>
            <Typography variant={matches ? 'body2' : 'h5'} color="primary">
              {formatMoney(currencyData, balanceData?.totalTransactions)}
            </Typography>
          </div>
        )}
        {balanceData?.balance > 0 && (
          <div
            style={
              matches
                ? { display: 'flex', flexDirection: 'column', marginLeft: '10px' }
                : { display: 'flex', flexDirection: 'column', marginLeft: '30px' }
            }
          >
            <Typography variant={matches ? 'caption' : 'subtitle1'}>
              {t('common:misc.general_funds')}
            </Typography>
            <Typography variant={matches ? 'body2' : 'h5'} color="primary">
              {formatMoney(currencyData, balanceData?.balance)}
            </Typography>
          </div>
        )}
      </div>
      {canCreateTransactions && (
        <div>
          <Fab
            color="primary"
            variant="extended"
            onClick={() => setPayOpen(true)}
            data-testid="add-payment"
            className={`${classes.addPayment} record-new-payment-btn`}
          >
            {t('common:misc.make_payment')}
          </Fab>
        </div>
      )}
      <PaymentModal
        open={payOpen}
        handleModalClose={() => setPayOpen(false)}
        userId={userId}
        currencyData={currencyData}
        refetch={balanceRefetch}
        walletRefetch={refetch}
        userData={userData}
        transRefetch={transRefetch}
        genRefetch={genRefetch}
      />
    </div>
  );
}

const useStyles = makeStyles(() => ({
  addPayment: {
    boxShadow: 'none',
    position: 'fixed',
    bottom: 20,
    right: 57,
    marginLeft: '30%',
    zIndex: '1000'
  }
}));

Balance.defaultProps = {
  userData: {},
  transRefetch: () => {},
  refetch: () => {},
  balanceRefetch: () => {},
  genRefetch: () => {},
  balanceData: {}
};

Balance.propTypes = {
  userId: PropTypes.string.isRequired,
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
  }).isRequired,
  balanceData: PropTypes.shape({
    id: PropTypes.string,
    pendingBalance: PropTypes.number,
    balance: PropTypes.number,
    totalTransactions: PropTypes.number
  }),
  refetch: PropTypes.func,
  transRefetch: PropTypes.func,
  balanceRefetch: PropTypes.func,
  genRefetch: PropTypes.func,
};
