import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, Button, Grid } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { objectAccessor } from '../../../utils/helpers';
import PageWrapper from '../../../shared/PageWrapper';

const icons = {
  mail: <MailOutlineIcon />,
  phone: <PhoneIcon />,
  whatsapp: <WhatsAppIcon />
};

const linkType = {
  phone: 'tel',
  mail: 'mailto'
};

export function SupportContact({ classes, support }) {
  const number = support.contact.replace(/\s/g, '');
  const whatsappLink = `https://api.whatsapp.com/send?phone=${number}`;
  const link = `${
    support.type === 'whatsapp'
      ? whatsappLink
      : `${objectAccessor(linkType, support.type)}:${number}`
  }`;

  return (
    <Grid container direction="row" className={classes.root}>
      <Grid item>{objectAccessor(icons, support.type)}</Grid>

      <Grid item>
        <Typography className={classes.pos} color="textSecondary">
          <a href={link}>{support.contact}</a>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default function SupportCard({ handleSendMessage, user }) {
  // eslint-disable-next-line no-use-before-define
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation('support_contact');

  function supports() {
    let result = handlePopulateSupports([], [], 'supportNumber', 'phone');
    result = handlePopulateSupports(
      result.sales,
      result.customerCare,
      'supportWhatsapp',
      'whatsapp'
    );
    result = handlePopulateSupports(result.sales, result.customerCare, 'supportEmail', 'mail');

    return {
      sales: result.sales,
      customerCare: result.customerCare
    };
  }

  function handlePopulateSupports(sales, customerCare, supportName, type) {
    let supportType = type;
    if (type === 'phone') supportType = 'phone_number';
    if (type === 'mail') supportType = 'email';
    // eslint-disable-next-line no-unused-expressions
    objectAccessor(user?.community, supportName)?.forEach(support => {
      if (support.category === 'sales')
        sales.push({
          contact: objectAccessor(support, supportType),
          type
        });
      if (support.category === 'customer_care')
        customerCare.push({
          contact: objectAccessor(support, supportType),
          type
        });
    });
    return {
      sales,
      customerCare
    };
  }

  return (
    <PageWrapper>
      <div>
        <Typography paragraph variant="body1" color="textSecondary" data-testid="new">
          {`${user?.community?.name} ${t('partnership.about_app_partnership')} ${t(
            'partnership.about_app_gate_access'
          )} ${
            user?.community?.name === 'Nkwashi'
              ? t('partnership.registration_kiosk')
              : t('partnership.incident_management')
          }  ${t('partnership.about_app_support_desk')}${
            user?.community?.name === 'Nkwashi' ? '' : t('partnership.adding_more_features')
          }.`}
        </Typography>

        <Typography variant="body1" color="textSecondary" component="p" align="center">
          {t('partnership.feedback_and_contact')}
        </Typography>
      </div>
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" align="center" gutterBottom color="textSecondary">
              {t('misc.sales_support')}
            </Typography>
            {supports().sales.length ? (
              supports().sales.map(support => (
                <SupportContact key={support.contact} classes={classes} support={support} />
              ))
            ) : (
              <Typography paragraph variant="body1" color="textSecondary" align="center">
                {t('misc.contacts_not_available')}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" align="center" gutterBottom color="textSecondary">
              {t('misc.customer_care')}
            </Typography>

            {supports().customerCare.length ? (
              supports().customerCare.map(support => (
                <SupportContact key={support.contact} classes={classes} support={support} />
              ))
            ) : (
              <Typography paragraph variant="body1" color="textSecondary" align="center">
                {t('misc.contacts_not_available')}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Grid container direction="row" className={classes.root}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            className={classes.chatButton}
          >
            {t('buttons.support_chat')}
          </Button>
        </Grid>

        {user.community && user.community.name && user.community.name === 'Nkwashi' && (
          <Grid container direction="row" className={classes.root}>
            <Button
              data-testid="pwmm"
              variant="contained"
              color="primary"
              onClick={() => history.push('/mobile_money')}
              className={classes.chatButton}
            >
              {t('buttons.pay_with_mobile_money')}
            </Button>
          </Grid>
        )}
        {Boolean(user?.userType !== 'custodian') && (
          <Grid container direction="row" className={classes.root}>
            <Button
              data-testid="feed"
              variant="contained"
              color="primary"
              onClick={() => history.push('/feedback')}
              className={classes.chatButton}
            >
              {t('buttons.feedback')}
            </Button>
          </Grid>
        )}
        {!['security_guard', 'custodian'].includes(user?.userType.toLowerCase()) ? (
          <Grid container direction="row" className={classes.root}>
            <Button
              data-testid="pwmm"
              variant="contained"
              color="primary"
              onClick={() => history.push('/map')}
              className={classes.chatButton}
            >
              {t('buttons.explore')}
            </Button>
          </Grid>
        ) : null}
        <Grid container direction="row" className={classes.root}>
          <Button
            data-testid="tos"
            variant="contained"
            color="primary"
            onClick={() =>
              window.open(
                'https://handbook.doublegdp.com/product/05-platform-policies/#terms-of-use',
                '_blank'
              )
            }
            style={{ fontSize: 14 }}
            className={classes.chatButton}
          >
            {t('buttons.privacy_and_terms')}
          </Button>
        </Grid>
      </div>
    </PageWrapper>
  );
}

SupportContact.propTypes = {
  support: PropTypes.shape({
    contact: PropTypes.string,
    type: PropTypes.string
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired
};
SupportCard.propTypes = {
  user: PropTypes.shape({
    userType: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    community: PropTypes.object
  }).isRequired,
  handleSendMessage: PropTypes.func.isRequired
};

const useStyles = makeStyles({
  root: {
    width: '100%',
    margin: 'auto',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatButton: {
    color: '#FFF',
    width: '55%',
    height: 51,
    boxShadow: 'none',
    marginTop: 50
  },
  title: {
    fontSize: 14
  },
  pos: {
    margin: 10
  }
});
