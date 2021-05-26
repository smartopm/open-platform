import React, { useContext, useState, useEffect } from 'react'
import { useLazyQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next';
import { UserBalance } from '../../../../graphql/queries'
import { Spinner } from '../../../../shared/Loading'
import { formatError, formatMoney, useParamsQuery } from '../../../../utils/helpers'
import { currencies } from '../../../../utils/constants'
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider'
import CenteredContent from '../../../../components/CenteredContent'
import ButtonComponent from '../../../../shared/buttons/Button'
import PaymentModal from './PaymentModal'

export default function Balance({ user, userId, userData, refetch }) {
  const authState = useContext(AuthStateContext);
  const path = useParamsQuery()
  const tab = path.get('tab')
  const { t } = useTranslation('common');
  const [payOpen, setPayOpen] = useState(false);
  const [
    loadBalance,
    { loading, error, data, refetch: planRefetch }
  ] = useLazyQuery(UserBalance, {
    variables: { userId },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

  const currency = currencies[user.community.currency] || ''
  const { locale } = user.community
  const currencyData = { currency, locale }

  useEffect(() => {
    if (tab === 'Plans' || tab === 'Payments') {
      loadBalance()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  if (error && !data) return <CenteredContent>{formatError(error.message)}</CenteredContent>

  return (
    <div>
      {
        loading ? <Spinner /> :  (
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{display: 'flex', flexDirection: 'column', marginLeft: '10px'}}>
              <Typography variant='subtitle1'>{t("common:misc.total_balance")}</Typography>
              <Typography variant="h5" color='primary'>{formatMoney(currencyData, data?.userBalance.pendingBalance)}</Typography>
            </div>
            {
              data?.userBalance?.pendingBalance && (
                <div style={{display: 'flex', flexDirection: 'column', marginLeft: '10px'}}>
                  <Typography variant='subtitle1'>{t("common:misc.total_balance")}</Typography>
                  <Typography variant="h5" color='primary'>
                    {data?.userBalance?.pendingBalance === 0 ? 
                    formatMoney(currencyData, data?.userBalance?.pendingBalance) :
                    `- ${formatMoney(currencyData, data?.userBalance?.pendingBalance)}`}
                  </Typography>
                </div>
              )
            }
            {
              data?.userBalance?.balance > 0 && (
                <div style={{display: 'flex', flexDirection: 'column', marginLeft: '30px'}}>
                  <Typography variant='subtitle1'>{t("common:misc.unallocated_funds")}</Typography>
                  <Typography variant="h5" color='primary'>{formatMoney(currencyData, data?.userBalance.balance)}</Typography>
                </div>
              )
            }
          </div>
        )
      }
      {
        authState.user?.userType === 'admin' && (
          <div>
            <ButtonComponent color='primary' buttonText={t("common:misc.make_payment")} handleClick={() => setPayOpen(true)} />
          </div>
        )
      }
      <PaymentModal
        open={payOpen}
        handleModalClose={() => setPayOpen(false)}
        userId={userId}
        currencyData={currencyData}
        refetch={planRefetch}
        walletRefetch={refetch}
        userData={userData}
      />
    </div>
  )
}

Balance.defaultProps = {
  userData: {}
}

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
  refetch: PropTypes.func.isRequired
}