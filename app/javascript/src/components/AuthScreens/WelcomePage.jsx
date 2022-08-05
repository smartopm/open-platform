import React, { useContext } from 'react';
import { Button, AppBar, Toolbar, Typography, Grid, Divider, Link } from '@mui/material';
import { StyleSheet, css } from 'aphrodite';
import ReactGA from 'react-ga';
import { useQuery } from 'react-apollo';
import { Redirect, useHistory } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
import MailIcon from '@mui/icons-material/Mail';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PropTypes from 'prop-types';
import logo from '../../../../assets/images/logo.png';
import nkwashiLogoUrl from '../../../../assets/images/logo-footer.png';
import thebeLogoUrl from '../../../../assets/images/thebe-logo.png';
import { CurrentCommunityQuery } from '../../modules/Community/graphql/community_query';
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider';

// TODO: We should redesign this page or deprecate it
export default function WelcomePage() {
  const authState = useContext(AuthStateContext);
  const { data: communityData, loading } = useQuery(CurrentCommunityQuery);
  const history = useHistory();

  if ((!loading && communityData?.currentCommunity?.name !== 'Nkwashi') || authState.loggedIn) {
    return <Redirect to="/login" />;
  }
  return (
    <>
      <AppBar position="static" style={{ backgroundColor: '#FFFFFF', boxShadow: 'none' }}>
        <Toolbar>
          <img
            src={logo}
            style={{
                  width: 110,
                  height: 40
                }}
            alt="Nkwashi logo with title"
          />
          <Typography variant="h6">News</Typography>
        </Toolbar>
      </AppBar>
      <div className="container_img">
        <img
          className="img-fluid home_hero"
          src="https://nkwashi.com/wp-content/uploads/2017/02/home-hero.jpg"
          alt="Nkwashi landing page"
        />
        <div className="centered" data-testid="maintext-centered">
          <h2>It&apos;s not just a house, it&apos;s a way of life</h2>
        </div>
        <br />
        <CustomButton
          variant="contained"
          color="primary"
          title="Apply for Nkwashi Residency"
          disableElevation
        />
        <br />
        <CustomButton title="Schedule a call" />
        <CustomButton title="Book a tour" />
        <CustomButton title="Become a client" />
        <br />
        <br />
        <p className={css(styles.mainText)} data-testid="maintext">
          Nkwashi is a new town that is being developed 36 kilometres east of the City of
          Lusaka. It is situated along Leopards Hill Road, approximately a 20 minute drive from
          Cross roads Shopping Mall and about a half hour drive from the Lusaka CBD. Nkwashi
          will include more than 9460 residential plots, as well as hundreds of acres of green
          areas and parks, 9 schools including an International School and an American
          University with a Teaching Hospital.
        </p>
        <p className={css(styles.mainText)} data-testid="nk_client">
          Already an Nkwashi client? Start your Nkwashi experience today.
        </p>
        <Button
          variant="contained"
          className={`${css(styles.getStartedButton)}`}
          onClick={() => history.push('/login')}
          data-testid="login_btn"
          color="primary"
        >
          Login
        </Button>

        <br />
        <br />
        <img src={nkwashiLogoUrl} alt="community logo" data-testid="nkwashi_logo" />

        <br />
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sm={6}>
            <LocationOnIcon color="primary" />
            <Typography component="p" color="primary" data-testid="locationtext">
              11 Nalikwanda Road, Lusaka, Zambia
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sm={6}>
            <CallIcon color="primary" />
            <Link href="tel:+260966194383" data-testid="contact" underline="hover">
              +260 966 194383
            </Link>
            ,
            {' '}
            <Link href="tel:+260760635024" underline="hover">+260 760 635024</Link>
          </Grid>
          <Grid item xs={12} md={4} sm={12}>
            <MailIcon color="primary" />
            <Typography component="p" data-testid="contact-email">
              <Link href="mailto:hello@thebe-im.com" underline="hover">hello@thebe-im.com</Link>
            </Typography>
          </Grid>
        </Grid>
        <Divider variant="middle" style={{ color: '#767676' }} />
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sm={4}>
            <img src={thebeLogoUrl} alt="thebe logo" data-testid="thebe_logo" />
          </Grid>
          <Grid item xs={12} md={4} sm={4}>
            <p className={css(styles.footerText)} data-testid="copyright_text">
              ©2017. Thebe Investment Management Limited. All Rights Reserved
            </p>
          </Grid>
          <Grid item xs={12} md={4} sm={4}>
            <Button startIcon={<FacebookIcon />} className={css(styles.iconButton)}>
              <a
                className={css(styles.socialLinks)}
                data-testid="fb_like"
                href="https://www.facebook.com/nkwashi.soar/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Like
              </a>
            </Button>
            <Button startIcon={<LinkedInIcon />} className={css(styles.iconButton)}>
              <a
                className={css(styles.socialLinks)}
                data-testid="ld_follow"
                href="https://www.linkedin.com/company/10478892"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow us
              </a>
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export function CustomButton({ title, ...props }) {
  const route = {
    call: 'https://forms.gle/4t553oiff7XTFYnW9',
    tour: 'https://forms.gle/9N79ZwKXTPxcrAta9',
    client: 'https://forms.gle/rtSH9oou9usUfJQ98',
    Nkwashi: 'https://forms.gle/AD36GCFfvD6j3t3t9'
  };
  function getName(name) {
    return name.split(' ')[2];
  }
  function handleClicks() {
    ReactGA.event({
      category: 'OpenPage',
      action: title,
      eventLabel: 'Open page Interaction',
      nonInteraction: true
    });
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return window.open(route[getName(title)], '_blank');
  }
  return (
    <Button
      variant="outlined"
      onClick={() => handleClicks(title)}
      className={css(styles.customButton)}
      {...props}
    >
      {title}
    </Button>
  );
}

CustomButton.propTypes = {
  title: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  customButton: {
    fontSize: 13,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  mainText: {
    color: '#767676',
    margin: 30,
    marginTop: 10
  },
  getStartedButton: {
    width: '35%',
    height: 51,
    boxShadow: 'none'
  },
  footerText: {
    color: '#767676',
    marginTop: 10
  },
  iconButton: {
    textTransform: 'none'
  },
  socialLinks: {
    textDecoration: 'none',
    color: '#767676',
    marginLeft: -7
  }
});
