import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';
import { useTranslation } from 'react-i18next';
import LogEntryIcon from '@mui/icons-material/Assignment';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import CallIcon from '@mui/icons-material/Call';
import PropTypes from 'prop-types'
import { FormControl, Select, InputBase, MenuItem, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useQuery, useMutation } from 'react-apollo';
import withStyles from '@mui/styles/withStyles';
import ScanIcon from '../../../../../assets/images/shape.svg';
import Avatar from '../../../components/Avatar';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { SecurityGuards } from '../../../graphql/queries';
import Loading from '../../../shared/Loading';
import ErrorPage from '../../../components/Error';
import { AUTH_TOKEN_KEY } from '../../../utils/apollo';
import { switchGuards } from '../../../graphql/mutations';
import { Footer } from '../../../components/Footer';
import FeatureCheck from '../../Features';

export const BootstrapInput = withStyles(() => ({
  input: {
    borderRadius: 6,
    position: 'relative',
    border: '1px solid #fff',
    fontSize: 18,
    padding: '14px 26px 4px 16px',
    height: 30
  }
}))(InputBase);

export default function GuardHome() {
  const { t } = useTranslation(['dashboard', 'common']);
  return <HomeGuard translate={t} />;
}

export function HomeGuard({ translate }) {
  const [redirect, setRedirect] = useState(false);
  const authState = useContext(Context);
  const hideGuardSwitching = false;
  const [id, setId] = React.useState(authState.user?.id);
  const { data, loading, error } = useQuery(SecurityGuards);
  const [loginSwitchUser] = useMutation(switchGuards);
  const [switchError, setSwitchError] = useState(null)

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
  if (loading) return <Loading />;
  if (error) return <ErrorPage title={error.message} />;
  return (
    <div>
      <div className={css(styles.inputGroup)}>
        <br />
        {hideGuardSwitching ? null : (
          <div>
            <div className="d-flex flex-row flex-wrap justify-content-center mb-3">
              <Avatar user={authState.user} />
              <br />
              <br />
            </div>
            <div className="d-flex flex-row flex-wrap justify-content-center mb-3">
              <FormControl
                variant="filled"
                style={{
                  minWidth: 120,
                  color: '#FFFFFF'
                }}
              >
                <span className={`${css(styles.switchAccount)}`}>Switch account</span>
                <br />
                <Select
                  id="demo-simple-select-outlined"
                  value={id}
                  onChange={handleChange}
                  style={{
                    width: 180,
                    backgroundColor: '#FFFFFF',
                    color: '#000000'
                  }}
                  variant="filled"
                  input={<BootstrapInput />}
                  IconComponent={() => (
                    <ArrowDropDownIcon
                      style={{
                        marginLeft: -34
                      }}
                    />
                  )}
                >
                  {data.securityGuards.map(guard => (
                    <MenuItem
                      style={{ color: '#000000' }}
                      value={guard.id}
                      key={guard.id}
                    >
                      {guard.name}
                    </MenuItem>
                  ))}
                </Select>
                <Typography color="secondary">
                  {switchError}
                </Typography>
              </FormControl>
            </div>
          </div>
        )}

        <input
          className={`form-control ${css(styles.input)}`}
          onFocus={inputToSearch}
          type="text"
          placeholder="Search"
        />
        <i className={`material-icons ${css(styles.searchIcon)}`}>search</i>
        <Link to="/scan">
          <img src={ScanIcon} alt="scan icon" className={` ${css(styles.scanIcon)}`} />
        </Link>
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
                    <p>{translate('dashboard.log_entry')}</p>
                  </div>
                </Link>
              </div>
              <div className={`${css(styles.cardSize)} card align-self-center text-center`}>
                <Link to="/logbook" className="card-link">
                  <div className="card-body">
                    <h5 className="card-title">
                      <LogEntryIcon color="primary" fontSize="large" />
                    </h5>
                    <p>{translate('dashboard.entry_logs')}</p>
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
                      <p>Time Card</p>
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
                    Call Manager
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <Footer position="5vh" />
      </div>
    </div>
  );
}

HomeGuard.propTypes = {
  translate: PropTypes.func.isRequired
}


const styles = StyleSheet.create({
  inputGroup: {
    position: 'relative'
  },
  input: {
    marginTop: '1em',
    padding: '0.5em 1em 0.5em 2em',
    height: 50,
    color: '#222',
    border: 'none',
    borderRadius: '5px',
    backgroundImage: 'none',
    backgroundColor: '#FFF',
    '::placeholder': {
      color: '#999'
    }
  },
  searchIcon: {
    color: '#999',
    position: 'absolute',
    left: 4,
    bottom: 11,
    'z-index': 9
  },
  scanIcon: {
    position: 'absolute',
    marginTop: 75,
    right: 9,
    width: 20,
    bottom: 12
  },
  switchAccount: {
    textDecoration: 'none',
    marginLeft: 25
  },
  cardSize: {
    width: 200,
    height: 154
  }
});
