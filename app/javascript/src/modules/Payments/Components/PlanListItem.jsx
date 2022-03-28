import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import makeStyles from '@mui/styles/makeStyles';
import { Checkbox, IconButton } from '@mui/material';
import { MoreHorizOutlined } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PaymentSlider from './PaymentSlider';
import Label from '../../../shared/label/Label';
import { toTitleCase, objectAccessor, formatMoney } from '../../../utils/helpers';
import MenuList from '../../../shared/MenuList';
import Text from '../../../shared/Text';
import { dateToString } from '../../../components/DateContainer';
import PaymentItem from './PaymentItem';
import CenteredContent from '../../../shared/CenteredContent';

export default function PlanListItem({
  data,
  currencyData,
  menuData,
  selectedPlans,
  handlePlansSelect
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(['payment', 'common']);
  const matches = useMediaQuery('(max-width:600px)');
  const smDownHidden = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const smUpHidden = useMediaQuery(theme => theme.breakpoints.up('sm'));

  const colors = {
    cancelled: '#e74540',
    on_track: '#00a98b',
    behind: '#eea92d',
    completed: '#29ec47'
  };

  return (
    <>
      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={8} sm={2} data-testid="landparcel" className={classes.bottom}>
          <Grid container spacing={2}>
            <Grid item sm={2}>
              <Checkbox
                checked={Boolean(
                  selectedPlans?.find(
                    obj => obj.paymentPlanId === data?.id && obj.userId === data?.user?.id
                  )
                )}
                onChange={() => handlePlansSelect(data.id, data.user.id)}
                name="includeReplyLink"
                data-testid="reply_link"
                color="primary"
                style={{ padding: '0px', marginRight: '15px' }}
              />
            </Grid>
            <Grid item sm={10}>
              <Typography className={classes.weight} variant="caption">
                {data?.landParcel?.parcelNumber}
              </Typography>
              {' '}
              -
              {' '}
              <Typography className={classes.weight} variant="caption">
                {data?.planType}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {
          !smUpHidden && (
            <Grid
              item
              xs={4}
              sm={1}
              data-testid="menu"
              style={{ textAlign: 'right', marginTop: '-10px' }}
            >
              {(data?.planStatus === 'behind' || data?.planStatus === 'on_track') && (
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                data-testid="plan-menu"
                dataid={data.id}
                onClick={event => menuData?.handleMenuClick(event, data)}
                size="large"
              >
                <MoreHorizOutlined />
              </IconButton>
            )}
              <MenuList
                open={menuData?.open && menuData?.anchorEl?.getAttribute('dataid') === data.id}
                anchorEl={menuData?.anchorEl}
                userType={menuData?.userType}
                handleClose={menuData?.handleClose}
                list={menuData?.menuList}
              />
            </Grid>
          )
        }
        <Grid item xs={12} sm={7} data-testid="payment-slider">
          <PaymentSlider data={data} currencyData={currencyData} />
        </Grid>
        <Grid item xs={12} sm={2} data-testid="label">
          <Label
            title={toTitleCase(data.planStatus || '')}
            color={objectAccessor(colors, data.planStatus)}
          />
        </Grid>
        {
          !smDownHidden && (
            <Grid item xs={12} sm={1} data-testid="menu">
              {(data?.planStatus === 'behind' || data?.planStatus === 'on_track') && (
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                data-testid="plan-menu"
                dataid={data.id}
                onClick={event => menuData?.handleMenuClick(event, data)}
                size="large"
              >
                <MoreHorizOutlined />
              </IconButton>
            )}
              <MenuList
                open={menuData?.open && menuData?.anchorEl?.getAttribute('dataid') === data.id}
                anchorEl={menuData?.anchorEl}
                userType={menuData?.userType}
                handleClose={menuData?.handleClose}
                list={menuData?.menuList}
              />
            </Grid>
          )
        }
        <Grid
          item
          xs={6}
          sm={2}
          data-testid="history"
          className={!matches ? classes.history : classes.historyMobile}
        >
          <Grid
            className={!matches ? classes.view : classes.viewMobile}
            onClick={() => setOpen(!open)}
            data-testid="view-history"
          >
            <Typography className={!matches ? classes.typography : classes.typoMobile}>
              {t('actions.view_history')}
            </Typography>
            <span className={classes.arrow}>
              {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            </span>
          </Grid>
        </Grid>
        {data?.planStatus === 'on_track' && (
          <Grid item xs={6} sm={7} data-testid="due-date">
            <CenteredContent>
              <Typography variant="caption">
                {t('misc.payment_due_date', {
                  date: dateToString(data?.upcomingInstallmentDueDate)
                })}
              </Typography>
              <Typography variant="caption" style={!matches ? { marginLeft: '10px' } : {}}>
                {t('misc.installment_amount', {
                  amount: formatMoney(currencyData, data?.installmentAmount)
                })}
              </Typography>
            </CenteredContent>
          </Grid>
        )}
        {open && (
          <>
            <Grid container className={classes.details}>
              <Grid item xs={12} md={3} data-testid="plot_user_info">
                <Link
                  to={`/user/${data?.user.id}?tab=Plans`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ display: 'flex' }}>
                    <Avatar src={data?.user.imageUrl} alt="avatar-image" />
                    <Typography style={{ margin: '7px', fontSize: '12px' }}>
                      <Text color="primary" content={data?.user.name} />
                    </Typography>
                  </div>
                </Link>
              </Grid>
              <Grid item xs={12} md={3} data-testid="start-date">
                {!matches ? (
                  <Text content={`${t('misc.starts_on')}: ${dateToString(data.startDate)}`} />
                ) : (
                  <Grid container>
                    <Grid item xs={6}>
                      <Text content={`${t('misc.starts_on')}:`} />
                    </Grid>
                    <Grid item xs={6} className={classes.detailsMobile}>
                      <Text content={`${dateToString(data.startDate)}`} />
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <Grid item xs={12} md={3} data-testid="start-date">
                {!matches ? (
                  <Text content={`${t('misc.ends_on')}: ${dateToString(data.endDate)}`} />
                ) : (
                  <Grid container>
                    <Grid item xs={6}>
                      <Text content={`${t('misc.ends_on')}:`} />
                    </Grid>
                    <Grid item xs={6} className={classes.detailsMobile}>
                      <Text content={`${dateToString(data.endDate)}`} />
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <Grid item xs={12} md={3} data-testid="start-date">
                {!matches ? (
                  <Text
                    content={`${t('misc.plan_values')}: ${formatMoney(
                      currencyData,
                      data?.planValue
                    )}`}
                  />
                ) : (
                  <Grid container>
                    <Grid item xs={6}>
                      <Text content={`${t('misc.plan_values')}:`} />
                    </Grid>
                    <Grid item xs={6} className={classes.detailsMobile}>
                      <Text content={`${formatMoney(currencyData, data?.planValue)}`} />
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
            {data?.planPayments?.length > 0 ? (
              data?.planPayments
                ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(payment => (
                  <PaymentItem
                    key={payment.id}
                    payment={payment}
                    matches={matches}
                    currencyData={currencyData}
                    t={t}
                  />
                ))
            ) : (
              <Grid container className={classes.details}>
                <Text content={t('misc.no_payments_made')} />
              </Grid>
            )}
          </>
        )}
      </Grid>
    </>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    backgroundColor: 'white',
    padding: '3%',
    border: '1px solid #ECECEC',
    borderRadius: '4px'
  },
  weight: {
    fontWeight: 500
  },
  bottom: {
    marginBottom: '10px'
  },
  history: {
    textAlign: 'center',
    display: 'flex'
  },
  historyMobile: {
    textAlign: 'center'
  },
  view: {
    background: '#E6E7E8',
    display: 'flex',
    padding: '5px 15px 0 15px'
  },
  viewMobile: {
    background: '#E6E7E8',
    display: 'flex',
    padding: '10px 15px 0 15px'
  },
  typography: {
    fontSize: '10px'
  },
  typoMobile: {
    fontSize: '9px'
  },
  arrow: {
    marginTop: '-5px'
  },
  details: {
    marginTop: '50px'
  },
  detailsMobile: {
    textAlign: 'right'
  }
}));

PlanListItem.defaultProps = {
  selectedPlans: []
};

PlanListItem.propTypes = {
  selectedPlans: PropTypes.arrayOf(PropTypes.object),
  handlePlansSelect: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    planType: PropTypes.string,
    planStatus: PropTypes.string,
    endDate: PropTypes.string,
    startDate: PropTypes.string,
    upcomingInstallmentDueDate: PropTypes.string,
    installmentAmount: PropTypes.string,
    planValue: PropTypes.number,
    user: PropTypes.shape({
      id: PropTypes.string,
      imageUrl: PropTypes.string,
      name: PropTypes.string
    }),
    landParcel: PropTypes.shape({
      parcelNumber: PropTypes.string,
      parcelType: PropTypes.string
    }),
    planPayments: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number,
        receiptNumber: PropTypes.string,
        createdAt: PropTypes.string,
        status: PropTypes.string
      })
    )
  }).isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
  menuData: PropTypes.shape({
    handleMenuClick: PropTypes.func,
    open: PropTypes.bool,
    anchorEl: PropTypes.shape({
      getAttribute: PropTypes.func
    }),
    userType: PropTypes.string,
    handleClose: PropTypes.func,
    menuList: PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.string
      })
    )
  }).isRequired
};
