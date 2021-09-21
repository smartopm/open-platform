import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { MoreHorizOutlined } from '@material-ui/icons';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import PaymentSlider from './PaymentSlider';
import Label from '../../../shared/label/Label';
import { toTitleCase, objectAccessor } from '../../../utils/helpers';
import MenuList from '../../../shared/MenuList';
import Text from '../../../shared/Text';
import { dateToString } from '../../../components/DateContainer';

export default function PlanListItem({ data, currencyData, menuData }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false)
  const { t } = useTranslation('payment');

  const colors = {
    cancelled: '#e74540',
    on_track: '#00a98b',
    behind: '#eea92d',
    completed: '#29ec47'
  };

  return (
    <>
      <Grid container spacing={2} className={classes.container} onClick={() => handleCardClick()}>
        <Grid item xs={6} sm={2} data-testid="landparcel" className={classes.bottom}>
          <Typography className={classes.weight} variant="caption">
            {data?.landParcel?.parcelNumber}
          </Typography>
          {' '}
          -
          {' '}
          <Typography className={classes.weight} variant="caption">
            {data?.planType}
          </Typography>
          <br />
          <Hidden smDown>
            <div style={{textAlign: 'center'}}>
              <IconButton
                aria-controls="drop-down"
                aria-haspopup="true"
              >
                {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
              </IconButton>
            </div>
          </Hidden>
        </Grid>
        <Hidden smUp>
          <Grid
            item
            xs={6}
            sm={1}
            data-testid="menu"
            style={{ textAlign: 'right', marginTop: '-10px' }}
          >
            {menuData?.userType === 'admin' && planStatus(data) === 'behind' && (
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                data-testid="plan-menu"
                dataid={data.id}
                onClick={event => menuData?.handleMenuClick(event, data)}
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
        </Hidden>
        <Grid item xs={12} sm={7} data-testid="payment-slider">
          <PaymentSlider data={data} currencyData={currencyData} />
        </Grid>
        <Grid item xs={12} sm={2} data-testid='label'>
          <Label title={toTitleCase(data.planStatus || '')} color={objectAccessor(colors, data.planStatus)} />
        </Grid>
        <Grid item xs={12} sm={1} data-testid="menu">
          {menuData?.userType === 'admin' && data.planStatus === 'behind' && (
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              data-testid="plan-menu"
              dataid={data.id}
              onClick={event => menuData?.handleMenuClick(event, data)}
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
        <Hidden smUp>
          <Grid item xs={12} style={{textAlign: 'center', marginTop: '-25px'}}>
            <IconButton
              aria-controls="drop-down"
              aria-haspopup="true"
            >
              {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>
          </Grid>
        </Hidden>
        <Hidden smDown>
          <Grid item xs={12} sm={1} data-testid="menu">
            {menuData?.userType === 'admin' && planStatus(data) === 'behind' && (
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                data-testid="plan-menu"
                dataid={data.id}
                onClick={event => menuData?.handleMenuClick(event, data)}
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
        </Hidden>
        {open && (
          <Grid container>
            <Grid item xs={12} md={4} data-testid="plot_user_info">
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
            <Grid item xs={6} md={4} data-testid="start-date">
              <Text content={`${t('misc.starts_on')} ${dateToString(data.startDate)}`} />
            </Grid>
            <Grid item xs={6} md={4} data-testid="start-date">
              <Text content={`${t('misc.ends_on')} ${dateToString(data.endDate)}`} />
            </Grid>
          </Grid>
          
        )}
      </Grid>
    </>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    backgroundColor: 'white',
    padding: '16px',
    border: '1px solid #ECECEC',
    borderRadius: '4px'
  },
  weight: {
    fontWeight: 500
  },
  bottom: {
    marginBottom: '10px'
  }
}));

PlanListItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    planType: PropTypes.string,
    planStatus: PropTypes.string,
    landParcel: PropTypes.shape({
      parcelNumber: PropTypes.string,
      parcelType: PropTypes.string
    })
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
