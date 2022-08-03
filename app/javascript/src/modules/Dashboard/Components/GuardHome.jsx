import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import LogEntryIcon from '@mui/icons-material/Assignment';
import InvitationIcon from '@mui/icons-material/InsertInvitation';
import GuardPostIcon from '@mui/icons-material/SensorDoor';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import CallIcon from '@mui/icons-material/Call';
import PropTypes from 'prop-types';
import { FormControl, Grid, Select, MenuItem, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useQuery, useMutation } from 'react-apollo';
import ScanIcon from '../../../../../assets/images/shape.svg';
import Avatar from '../../../components/Avatar';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { SecurityGuards } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../shared/CenteredContent';
import { formatError } from '../../../utils/helpers';
import { AUTH_TOKEN_KEY } from '../../../utils/apollo';
import { switchGuards } from '../../../graphql/mutations';
import { Footer } from '../../../components/Footer';
import FeatureCheck from '../../Features';
import AccessCheck from '../../Permissions/Components/AccessCheck';
import PageWrapper from '../../../shared/PageWrapper';
import LanguageToggle from '../../i18n/Components/LanguageToggle';
import { BootstrapInput } from '../../../utils/constants';

export default function GuardHome() {
  const { t } = useTranslation(['dashboard', 'common']);
  return (
    <AccessCheck module="dashboard" allowedPermissions={['can_access_guard_dashboard']} show404ForUnauthorized={false}>
      <HomeGuard translate={t} />
    </AccessCheck>
  )
}

export function HomeGuard({ translate }) {
  const [redirect, setRedirect] = useState(false);
  const authState = useContext(Context);
  const hideGuardSwitching = false;
  const [id, setId] = React.useState(authState.user?.id);
  const { data, loading, error } = useQuery(SecurityGuards);
  const [loginSwitchUser] = useMutation(switchGuards);
  const [switchError, setSwitchError] = useState(null);
  const largerScreens = useMediaQuery('(min-width:960px)');
  const isMobile = useMediaQuery('(max-width:800px)');

  function inputToSearch() {
    setRedirect('/search');
  }
  const handleChange = event => {
    setId(event.target.value);
    loginSwitchUser({
      variables: { id: event.target.value }
    })
      // eslint-disable-next-line no-shadow
      .then(({ data }) => {
        localStorage.setItem(AUTH_TOKEN_KEY, data.loginSwitchUser.authToken);
        // reloading the page to propagate the new user details
        window.location.href = '/guard_home';
      })
      // eslint-disable-next-line no-shadow
      .catch(error => {
        setSwitchError(error.message);
      });
  };
  if (redirect) {
    return (
      <Redirect
        push
        to={{
          pathname: redirect,
          state: { from: '/guard_home' }
        }}
      />
    );
  }
  if (loading) return <Spinner />;
  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  return (
    <PageWrapper pageTitle={translate('dashboard.dashboard')}>
      <Grid
        container
        style={{ display: 'flex', justifyContent: 'center' }}
        columns={{ xs: 12, md: 12 }}
      >
        <Grid item md={8} xs={10}>
          <div className={css(styles.inputGroup)}>
            <br />
            {hideGuardSwitching ? null : (
              <div>
                <div className="d-flex flex-row flex-wrap justify-content-center mb-5">
                  <Avatar user={authState.user} />
                  <br />
                  <br />
                </div>
                <Grid
                  container
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Grid
                    item
                    md={3}
                    xs={6}
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      mt: 5,
                    }}
                  >
                    <input
                      className={`${css(styles.input)}`}
                      onFocus={inputToSearch}
                      type="text"
                      placeholder="Search"
                    />
                    <SearchIcon
                      style={{
                        marginLeft: '10px',
                        zIndex: 9,
                      }}
                      color="#999"
                    />
                  </Grid>
                  <Grid
                    item
                    md={3}
                    xs={6}
                    sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}
                  >
                    <FormControl variant="filled">
                      <Select
                        id="demo-simple-select-outlined"
                        value={id}
                        onChange={handleChange}
                        style={{
                          width: isMobile ? 140 : 170,
                          backgroundColor: '#FFFFFF',
                          color: '#000000',
                        }}
                        variant="filled"
                        input={<BootstrapInput />}
                        IconComponent={() => (
                          <ArrowDropDownIcon
                            style={{
                              marginLeft: -34,
                            }}
                          />
                        )}
                      >
                        {data.securityGuards.map(guard => (
                          <MenuItem style={{ color: '#000000' }} value={guard.id} key={guard.id}>
                            {guard.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <Typography color="secondary">{switchError}</Typography>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    md={3}
                    xs={6}
                    sx={{
                      display: 'flex',
                      justifyContent: largerScreens ? 'center' : 'flex-start',
                      mt: 5,
                    }}
                  >
                    <Link to="/scan">
                      <img
                        src={ScanIcon}
                        alt="scan icon"
                        className={` ${css(styles.scanIcon)}`}
                        style={{
                          margin: '15px auto',
                        }}
                      />
                    </Link>
                  </Grid>
                  <Grid item md={3} xs={6} sx={{ marginTop: '5px' }}>
                    <LanguageToggle />
                  </Grid>
                </Grid>
              </div>
            )}
          </div>

          <div className="container">
            <div className="row justify-content-center">
              <div className="col-4-lg col-12-sm index-cards">
                <div className="d-flex flex-row flex-wrap justify-content-center mb-3">
                  <div className={`${css(styles.cardSize)} card align-self-center text-center`}>
                    <Link to="/scan" className="card-link">
                      <div className="card-body">
                        <h5 className="card-title">
                          <SelectAllIcon color="primary" fontSize="large" />
                        </h5>
                        <p>{translate('dashboard.scan')}</p>
                      </div>
                    </Link>
                  </div>
                  <div className={`${css(styles.cardSize)} card align-self-center text-center`}>
                    <Link to={`/id/${authState.user?.id}`} className="card-link">
                      <div className="card-body">
                        <h5 className="card-title">
                          <PersonIcon color="primary" fontSize="large" />
                        </h5>
                        <p>{translate('dashboard.identity')}</p>
                      </div>
                    </Link>
                  </div>
                  <div className={`${css(styles.cardSize)} card align-self-center text-center`}>
                    <Link to="/request" className="card-link">
                      <div className="card-body">
                        <h5 className="card-title">
                          <RecentActorsIcon color="primary" fontSize="large" />
                        </h5>
                        <p>{translate('dashboard.manual_entry')}</p>
                      </div>
                    </Link>
                  </div>
                  <div className={`${css(styles.cardSize)} card align-self-center text-center`}>
                    <Link to="/logbook" className="card-link">
                      <div className="card-body">
                        <h5 className="card-title">
                          <LogEntryIcon color="primary" fontSize="large" />
                        </h5>
                        <p>{translate('dashboard.logs')}</p>
                      </div>
                    </Link>
                  </div>
                  <div className={`${css(styles.cardSize)} card align-self-center text-center`}>
                    <Link to="/guard_post" className="card-link">
                      <div className="card-body">
                        <h5 className="card-title">
                          <GuardPostIcon color="primary" fontSize="large" />
                        </h5>
                        <p>{translate('dashboard.guard_post')}</p>
                      </div>
                    </Link>
                  </div>
                  <div className={`${css(styles.cardSize)} card align-self-center text-center`}>
                    <Link to="/logbook/invitations" className="card-link">
                      <div className="card-body">
                        <h5 className="card-title">
                          <InvitationIcon color="primary" fontSize="large" />
                        </h5>
                        <p>{translate('dashboard.invitations')}</p>
                      </div>
                    </Link>
                  </div>
                  <FeatureCheck features={authState.user?.community.features} name="Time Card">
                    <div className={`${css(styles.cardSize)} card align-self-center text-center`}>
                      <Link to={`/timesheet/${authState.user?.id}`} className="card-link">
                        <div className="card-body">
                          <h5 className="card-title">
                            <LogEntryIcon fontSize="large" color="primary" />
                          </h5>
                          <p>{translate('common:misc.time_card')}</p>
                        </div>
                      </Link>
                    </div>
                  </FeatureCheck>
                  <div className={`${css(styles.cardSize)} card align-self-center text-center`}>
                    <a href={`tel:${authState.user.community.securityManager}`}>
                      <div className="card-body">
                        <h5 className="card-title">
                          <CallIcon color="primary" fontSize="large" />
                        </h5>
                        {translate('common:misc.call_manager')}
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <Footer position="5vh" />
          </div>
        </Grid>
      </Grid>
    </PageWrapper>
  );
}

HomeGuard.propTypes = {
  translate: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  inputGroup: {
    position: 'relative'
  },
  input: {
    width: '50%',
    maxWidth: '75%',
    color: '#222',
    border: 'none',
    borderRadius: '5px',
    backgroundImage: 'none',
    backgroundColor: '#FFF',
    '::placeholder': {
      color: '#999'
    }
  },
  scanIcon: {
    width: 20
  },
  cardSize: {
    width: 200,
    height: 154
  }
});
