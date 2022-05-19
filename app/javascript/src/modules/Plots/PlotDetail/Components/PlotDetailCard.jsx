/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../components/CenteredContent';
import { formatError, formatMoney, objectAccessor } from '../../../../utils/helpers';
import EmptyCard from '../../../../shared/EmptyCard';
import { currencies } from '../../../../utils/constants';
import { UserPlans } from '../../../Payments/graphql/payment_query';

export default function PlotDetailCard({ authState }) {
  const matches = useMediaQuery('(max-width:600px)');
  const currency = objectAccessor(currencies, authState?.community?.currency) || '';
  const currencyData = { currency, locale: authState?.community?.locale };
  const { loading, data, error } = useQuery(UserPlans, {
    variables: {
      userId: authState.id
    },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  const history = useHistory();
  const classes = useStyles();
  const { t } = useTranslation(['dashboard', 'common', 'payment']);

  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <Typography
            data-testid="plot"
            style={
              matches
                ? {
                    margin: '20px 0 10px 20px',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: '#141414'
                  }
                : {
                    margin: '40px 0 20px 20px',
                    fontWeight: 500,
                    fontSize: '22px',
                    color: '#141414'
                  }
            }
          >
            {t('dashboard.plot_detail', { count: 0 })}
          </Typography>
          <div>
            {data?.userPlansWithPayments?.filter(plan => plan.status !== 'general').length > 0 ? (
              <div
                className={classes.root}
                style={
                  matches ? { marginLeft: '20px' } : { marginLeft: '20px', marginBottom: '40px' }
                }
              >
                <ImageList className={classes.gridList} cols={matches ? 1 : 3}>
                  {data?.userPlansWithPayments
                    ?.filter(plan => plan.status !== 'general')
                    ?.map(plan => (
                      <ImageListItem key={plan.id}>
                        <div
                          className={matches ? classes.gridTileMobile : classes.gridTile}
                          onClick={() => history.push(`/user/${authState.id}?tab=Plans`)}
                        >
                          <div>
                            <Typography className={matches ? classes.plotMobile : classes.plot}>
                              {t('dashboard.plot')} 
                              {' '}
                              {plan.landParcel.parcelNumber}
                            </Typography>
                          </div>
                          <div>
                            <Typography
                              className={matches ? classes.balanceMobile : classes.balance}
                            >
                              {formatMoney(currencyData, plan.pendingBalance)}
                            </Typography>
                            <Typography
                              className={matches ? classes.balanceTextMobile : classes.balanceText}
                            >
                              {t('payment:table_headers.balance_due')}
                            </Typography>
                          </div>
                        </div>
                      </ImageListItem>
                    ))}
                </ImageList>
              </div>
            ) : (
              <EmptyCard
                title={t('dashboard.no_plots_available')}
                subtitle={t('dashboard.plots_appear_here')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden'
  },
  gridList: {
    flexWrap: 'nowrap',
    width: '100%'
  },
  gridTile: {
    display: 'flex',
    border: '1px solid #EBEBEB',
    padding: '20px',
    backgroundColor: theme.palette.background.paper,
    height: '178px',
    justifyContent: 'space-between',
    cursor: 'pointer',
    overflow: 'hidden',
    borderRadius: '8px'
  },
  date: {
    display: 'flex',
    marginBottom: '-8px'
  },
  plot: {
    fontWeight: 700,
    fontSize: '18px',
    color: '#141414',
    marginBottom: '12px'
  },
  invoice: {
    marginBottom: '7px',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: 1.375,
    color: '#141414'
  },
  balance: {
    fontWeight: 600,
    fontSize: '24px',
    color: '#141414',
    marginBottom: '3.5px'
  },
  balanceText: {
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: 1.375,
    color: '#838383'
  },
  gridTileMobile: {
    display: 'flex',
    border: '1px solid #EBEBEB',
    padding: '10px',
    backgroundColor: theme.palette.background.paper,
    height: '140px',
    width: '263px',
    justifyContent: 'space-between',
    cursor: 'pointer',
    overflow: 'hidden',
    borderRadius: '8px'
  },
  plotMobile: {
    fontWeight: 700,
    fontSize: '14px',
    color: '#141414',
    marginBottom: '7.5px'
  },
  invoiceMobile: {
    marginBottom: '4px',
    fontWeight: 500,
    fontSize: '11px',
    lineHeight: 1.5,
    color: '#141414'
  },
  balanceMobile: {
    fontWeight: 600,
    fontSize: '18px',
    color: '#141414',
    marginBottom: '1.5px'
  },
  balanceTextMobile: {
    fontWeight: 400,
    fontSize: '11px',
    lineHeight: 1.5,
    color: '#838383'
  }
}));

PlotDetailCard.propTypes = {
  authState: PropTypes.shape({
    id: PropTypes.string,
    community: PropTypes.shape({
      currency: PropTypes.string,
      locale: PropTypes.string
    })
  }).isRequired
};
