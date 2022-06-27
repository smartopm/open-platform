/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useLazyQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography } from '@mui/material';
import UserPaymentPlanItem from './UserPaymentPlanItem';
import Balance from './UserBalance';
import { UserLandParcels, UserBalance } from '../../../../graphql/queries';
import DepositQuery, { UserPlans, GeneralPlanQuery } from '../../graphql/payment_query';
import { Spinner } from '../../../../shared/Loading';
import { formatError, useParamsQuery, objectAccessor } from '../../../../utils/helpers';
import { currencies } from '../../../../utils/constants';
import CenteredContent from '../../../../shared/CenteredContent';
import Paginate from '../../../../components/Paginate';
import ListHeader from '../../../../shared/list/ListHeader';
import ButtonComponent from '../../../../shared/buttons/Button';
import Transactions from './Transactions';
import PaymentPlanModal from './PaymentPlanModal';
import MessageAlert from '../../../../components/MessageAlert';
import GeneralPlanList from './GeneralPlanList'

export default function PaymentPlans({ userId, user, userData }) {
  const { t } = useTranslation(['payment', 'common']);
  const planHeader = [
    { title: 'Plot Number', value: t('common:table_headers.plot_number'), col: 2 },
    { title: 'Payment Plan', value: t('common:table_headers.payment_plan'), col: 2 },
    { title: 'Start Date', value: t('common:table_headers.start_date'), col: 2 },
    { title: 'Balance/Monthly Amount', value: t('common:table_headers.balance_amount'), col: 2 },
    { title: 'Payment Day', value: t('common:table_headers.payment_day'), col: 2 },
    { title: 'Menu', value: t('common:table_headers.menu'), col: 2 }
  ];
  const history = useHistory();
  const path = useParamsQuery();
  const subtab = path.get('subtab');
  const id = path.get('id');
  const classes = useStyles();
  const limit = 10;
  const page = path.get('page');
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const [offset, setOffset] = useState(Number(page) || 0);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const [alertOpen, setAlertOpen] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [loadPlans, { loading, error, data, refetch }] = useLazyQuery(UserPlans, {
    variables: { userId, limit, offset },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

  const [loadGeneralPlans, { error: genError, data: genData, refetch: genRefetch }] = useLazyQuery(GeneralPlanQuery, {
    variables: { userId },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

  const [
    loadTransactions,
    { loading: transLoading, error: transError, data: transData, refetch: transRefetch }
  ] = useLazyQuery(DepositQuery, {
    variables: { userId, limit, offset },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

  const [loadLandParcels, { data: landParcelsData }] = useLazyQuery(UserLandParcels, {
    variables: { userId },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

  const currency = objectAccessor(currencies, user.community.currency) || '';
  const { locale } = user.community;
  const currencyData = { currency, locale };

  const userTransactionPermissions = user?.permissions?.find(permissionObject => permissionObject.module === 'payment_records')
  const canFetchUserTransactions = userTransactionPermissions? userTransactionPermissions.permissions.includes('can_fetch_user_transactions'): false

  const userPaymentPlanPermissions = user?.permissions.find(permissionObject => permissionObject.module === 'payment_plan')
  const canCreatePaymentPlan = userPaymentPlanPermissions? userPaymentPlanPermissions.permissions.includes('can_create_payment_plan'): false

  const [
    loadBalance,
    { loading: balanceLoad, error: balanceError, data: balanceData, refetch: balanceRefetch }
  ] = useLazyQuery(UserBalance, {
    variables: { userId },
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

  function handleButtonClick() {
    history.push('?tab=Plans&subtab=Transactions');
    setFiltering(false);
  }

  function handlePlanModal() {
    setPlanModalOpen(true);
    loadLandParcels();
  }
  useEffect(() => {
    loadGeneralPlans();
    loadPlans();
    loadBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (subtab === 'Transactions') {
      loadTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtab]);

  if (error && !data) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  if (balanceError && !balanceData)
    return <CenteredContent>{formatError(balanceError.message)}</CenteredContent>;
  if (transError && !transData)
    return <CenteredContent>{formatError(transError.message)}</CenteredContent>;
    if (genError && !genData)
    return <CenteredContent>{formatError(genError.message)}</CenteredContent>;

  return (
    <div>
      {balanceLoad ? (
        <Spinner />
      ) : (
        <Balance
          user={user}
          userData={userData}
          refetch={refetch}
          balanceData={balanceData?.userBalance}
          balanceRefetch={balanceRefetch}
          transRefetch={transRefetch}
          genRefetch={genRefetch}
          userId={userId}
        />
      )}
      {subtab === 'Transactions' &&
       canFetchUserTransactions ? (
        transLoading ? (
          <Spinner />
        ) : (
          <>
            <Transactions
              userId={userId}
              user={user}
              userData={userData}
              transData={transData}
              refetch={transRefetch}
              balanceRefetch={balanceRefetch}
              planData={data?.userPlansWithPayments}
              filtering={filtering}
              setFiltering={setFiltering}
            />
            {!id && !filtering && (
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
          </>
        )
      ) : loading ? (
        <Spinner />
      ) : (
        <>
          <div className={classes.planList}>
            <div>
              <div
                style={matches ? {
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                } : null}
              >
                <Typography className={matches ? classes.plan : classes.planMobile}>
                  {t('common:misc.plans')}
                </Typography>
                <div
                  style={
                      matches
                        ? { display: 'flex', width: '100%', justifyContent: 'flex-end' }
                        : { display: 'flex' }
                    }
                >
                  {canCreatePaymentPlan && (
                    <div style={{ margin: '0 10px 10px 0', fontSize: '10px' }}>
                      <ButtonComponent
                        color="primary"
                        variant="contained"
                        buttonText={t('actions.new_payment_plan')}
                        handleClick={() => handlePlanModal()}
                        size="small"
                        style={matches ? {} : {fontSize: '10px'}}
                        className='new-payment-plan-btn'
                      />
                    </div>
                   )}
                  {canFetchUserTransactions && (
                    <div>
                      <ButtonComponent
                        color="primary"
                        variant="outlined"
                        buttonText={t('actions.view_all_transactions')}
                        handleClick={() => handleButtonClick()}
                        size="small"
                        style={matches ? {} : {fontSize: '10px'}}
                      />
                    </div>
                   )}
                </div>
                <MessageAlert
                  type={message.isError ? 'error' : 'success'}
                  message={message.detail}
                  open={alertOpen}
                  handleClose={() => setAlertOpen(false)}
                />
                {planModalOpen && (
                  <PaymentPlanModal
                    open={planModalOpen}
                    handleModalClose={() => setPlanModalOpen(false)}
                    userId={userId}
                    userData={userData}
                    currency={currency}
                    paymentPlansRefetch={refetch}
                    landParcelsData={landParcelsData}
                    setMessage={setMessage}
                    openAlertMessage={() => setAlertOpen(true)}
                    balanceRefetch={balanceRefetch}
                    genRefetch={genRefetch}
                  />
                )}
              </div>
              {Boolean(genData?.userGeneralPlan?.generalPayments) && genData?.userGeneralPlan?.generalPayments > 0 && (
                <GeneralPlanList
                  data={genData?.userGeneralPlan}
                  currencyData={currencyData}
                  currentUser={user}
                  userId={userId}
                  balanceRefetch={balanceRefetch}
                  genRefetch={genRefetch}
                  paymentPlansRefetch={refetch}
                />
              )}
              {matches && <ListHeader headers={planHeader} color />}
            </div>
          </div>
          {data?.userPlansWithPayments?.length > 0 ? (
            <div>
              <UserPaymentPlanItem
                plans={data.userPlansWithPayments}
                currencyData={currencyData}
                userData={userData}
                currentUser={user}
                userId={userId}
                refetch={refetch}
                balanceRefetch={balanceRefetch}

              />
            </div>
          ) : (
            <CenteredContent><div data-testid='no-plan-available'>{t('errors.no_plan_available')}</div></CenteredContent>
          )}
          <CenteredContent>
            <Paginate
              offSet={offset}
              limit={limit}
              active={offset >= 1}
              handlePageChange={paginate}
              count={data?.userPlansWithPayments?.length}
            />
          </CenteredContent>
        </>
      )}
    </div>
  );
}

PaymentPlans.defaultProps = {
  userData: {}
};

PaymentPlans.propTypes = {
  userId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  userData: PropTypes.object,
  user: PropTypes.shape({
    id: PropTypes.string,
    userType: PropTypes.string,
    permissions: PropTypes.arrayOf(
      PropTypes.shape({
        permissions: PropTypes.arrayOf(PropTypes.string),
        module: PropTypes.string
      }),
    ),
    community: PropTypes.shape({
      imageUrl: PropTypes.string,
      name: PropTypes.string,
      currency: PropTypes.string,
      locale: PropTypes.string
    }).isRequired
  }).isRequired
};

const useStyles = makeStyles({
  plan: {
    fontWeight: 500,
    fontSize: '20px',
    color: '#313131',
    marginBottom: '30px'
  },
  planMobile: {
    fontWeight: 500,
    fontSize: '16px',
    color: '#313131',
    marginBottom: '10px'
  },
  planList: {
    backgroundColor: '#FDFDFD',
    padding: '20px',
    borderRadius: '4px',
    border: '1px solid #EEEEEE',
    marginTop: '20px'
  }
});
