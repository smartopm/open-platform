import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { MoreHorizOutlined } from '@material-ui/icons';
import PaymentSlider from './PaymentSlider';
import Label from '../../../shared/label/Label';
import { capitalize, objectAccessor } from '../../../utils/helpers';
import MenuList from '../../../shared/MenuList';

export default function PlanListItem({ data, currencyData, menuData }) {
  const classes = useStyles();

  const colors = {
    cancelled: '#e74540',
    'on track': '#00a98b',
    behind: '#eea92d',
    completed: '#29ec47'
  };

  return (
    <>
      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12} sm={2} data-testid='landparcel' className={classes.bottom}>
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
          <Typography className={classes.weight} variant="caption">
            {data?.landParcel?.parcelType}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={7} data-testid='payment-slider'>
          <PaymentSlider data={data} currencyData={currencyData} />
        </Grid>
        <Grid item xs={12} sm={2} data-testid='label'>
          <Label title={capitalize(data.planStatus || '')} color={objectAccessor(colors, data.planStatus)} />
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
}
