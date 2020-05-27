import React, { useContext, useState, Fragment } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { StyleSheet, css } from 'aphrodite'
import { useTranslation } from 'react-i18next'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'
import Nav from '../components/Nav'
import Loading from '../components/Loading.jsx'
import ScanIcon from '../../../assets/images/shape.svg'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import HelpIcon from '@material-ui/icons/Help'
import ExploreIcon from '../../../assets/images/icon_map.svg'
import NewsIcon from '../../../assets/images/iconfinder.svg'
import AccountManagement from '../../../assets/images/account_management.svg'
import PersonIcon from '@material-ui/icons/Person'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import LogIcon from '@material-ui/icons/Assignment'
import NotesIcon from '@material-ui/icons/Notes'
import FeedbackIcon from '@material-ui/icons/Feedback'
import ForumIcon from '@material-ui/icons/Forum'
import { Footer } from '../components/Footer.jsx'
import QRIcon from '../../../assets/images/icon_qr_card_fill_copy.svg'
import { ponisoNumber } from '../utils/constants.js'
import CallIcon from '@material-ui/icons/Call'
import SocialMediaLinks from '../components/SocialMediaLinks.jsx'
import ListAltIcon from '@material-ui/icons/ListAlt';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PeopleIcon from '@material-ui/icons/People'
import RecentActorsIcon from '@material-ui/icons/RecentActors';

export default function Home() {
  const authState = useContext(AuthStateContext)

  if (!authState.loggedIn) return <Loading />
  return <Component authState={authState} />
}
export function Component({ authState }) {
  const [redirect, setRedirect] = useState(false)
  const { t } = useTranslation()
  function inputToSearch() {
    setRedirect('/search')
  }
  // TODO: Make this just a conditional part of Home
  if (authState.user.userType === 'security_guard') {
    return <Redirect push to="/guard_home" />
  }

  if (redirect) {
    return (
      <Redirect
        push
        to={{
          pathname: redirect,
          state: { from: '/' }
        }}
      />
    )
  }
  const userData = authState.user;

  return (
    <div>
      <Nav>
        {['security_guard', 'admin', 'custodian'].includes(
          authState.user.userType.toLowerCase()
        ) && (
            <div className={css(styles.inputGroup)}>
              <input
                className={`form-control ${css(styles.input)}`}
                onFocus={inputToSearch}
                type="text"
                placeholder="Search"
              />
              <i className={`material-icons ${css(styles.searchIcon)}`}>search</i>
              <Link to="/scan">
                <img
                  src={ScanIcon}
                  alt="scan icon"
                  className={` ${css(styles.scanIcon)}`}
                />
              </Link>
            </div>
          )}
      </Nav>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-4-lg col-12-sm index-cards">
            <div className="d-flex flex-row flex-wrap justify-content-center mb-3">
              {!['security_guard', 'resident', 'custodian'].includes(
                authState.user.userType.toLowerCase()
              ) ? (
                  <div
                    className={`${css(
                      styles.cardSize
                    )} card align-self-center text-center`}
                  >
                    <Link to={'/map'} className={`card-link`}>
                      <div className="card-body">
                        <h5 className="card-title">
                          <img src={ExploreIcon} alt="map icon" />
                        </h5>
                        <p className={css(styles.CardtextImg)}>{t('home.explore')}</p>
                      </div>
                    </Link>
                  </div>
                ) : null}

              {Boolean(authState.user.userType === 'custodian') && (
                <div
                  className={`${css(
                    styles.cardSize
                  )} card align-self-center text-center`}
                >
                  <Link to={`/scan`} className={`card-link`}>
                    <div className="card-body">
                      <h5 className="card-title">
                        <img src={QRIcon} alt="support icon" />
                      </h5>
                      <p className={css(styles.CardtextImg)}>{t('home.scan')}</p>
                    </div>
                  </Link>
                </div>
              )}

              <div
                className={`${css(
                  styles.cardSize
                )} card align-self-center text-center`}
              >
                <Link to={`/id/${authState.user.id}`} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      <PersonIcon fontSize='large' className={css(styles.homeIconColor)} />
                    </h5>
                    <p className={css(styles.CardtextIcon)}>{t('home.identity')}</p>
                  </div>
                </Link>
              </div>

              {/* Boolean(authState.user.userType !== 'custodian') */}
              {Boolean(authState.user.userType !== 'custodian') && (
                <div
                  className={`${css(
                    styles.cardSize
                  )} card align-self-center text-center`}
                >
                  <Link to={'/contact'} className={`card-link`}>
                    <div className="card-body">
                      <h5 className="card-title">
                        <HelpIcon fontSize='large' className={css(styles.homeIconColor)} />
                      </h5>
                      <p className={css(styles.CardtextIcon)}>{'Contact'}</p>
                    </div>
                  </Link>
                </div>
              )}

              {Boolean(authState.user.userType !== 'custodian') && (
                <div
                  className={`${css(
                    styles.cardSize
                  )} card align-self-center text-center`}
                >
                  <Link to="/news" className={`card-link`}>
                    <div className="card-body">
                      <h5 className="card-title">
                        <img
                          src={NewsIcon}
                          className={css(styles.homeIconColor)}
                          alt=" news icons"
                        />
                      </h5>
                      <p className={css(styles.CardtextImg)}>News</p>
                    </div>
                  </Link>
                </div>
              )}

              {[ 'admin'].includes(
                authState.user.userType.toLowerCase()
              ) ? (
                  <Fragment>
                    <div
                      className={`${css(
                        styles.cardSize
                      )} card align-self-center text-center`}
                    >
                      <Link to={'/users'} className={`card-link`}>
                        <div className="card-body">
                          <h5 className="card-title">
                            <RecentActorsIcon fontSize="large" className={css(styles.homeIconColor)} />
                          </h5>
                          <p className={css(styles.CardtextIcon)}>{'Users'}</p>
                        </div>
                      </Link>
                    </div>
                  </Fragment>
                ) : null}

              {['resident','client'].includes(authState.user.userType.toLowerCase()) ? (
                <div
                  className={`${css(
                    styles.cardSize
                  )} card align-self-center text-center`}
                >
                  <Link to={{
                      pathname: `/myaccount/${authState.user.id}`,
                      state: {
                        from: 'acc'
                      }
                    }}>
                    <div className="card-body">
                      <h5 className="card-title">
                      <AccountCircleIcon fontSize="large" className={css(styles.homeIconColor)} />
                      </h5>
                      <p className={css(styles.CardtextIcon)}>My Account</p>
                    </div>
                  </Link>
                </div>
              ) : null}

              {['admin', 'resident', 'client'].includes(authState.user.userType.toLowerCase()) ? (
                <div
                  className={`${css(
                    styles.cardSize
                  )} card align-self-center text-center`}
                >
                  <Link to={{
                    pathname: '/account',
                    state: {
                      clientName: authState.user.name,
                      from: 'home'
                    }
                  }} className={`card-link`}>
                    <div className="card-body">
                      <h5 className="card-title">
                        <img
                          src={AccountManagement}
                          className={css(styles.homeIconColor)}
                          alt="account management icon"
                        />
                      </h5>

                      <p className={css(styles.CardtextImg)}>My Thebe Portal</p>
                    </div>
                  </Link>
                </div>
              ) : null}

              {['security_guard', 'admin'].includes(
                authState.user.userType.toLowerCase()
              ) ? (
                  <Fragment>
                    <div
                      className={`${css(
                        styles.cardSize
                      )} card align-self-center text-center`}
                    >
                      <Link to={'/entry_logs'} className={`card-link`}>
                        <div className="card-body">
                          <h5 className="card-title">
                            <LogIcon fontSize="large" className={css(styles.homeIconColor)} />
                          </h5>
                          <p className={css(styles.CardtextIcon)}>{'Log Book'}</p>
                        </div>
                      </Link>
                    </div>
                  </Fragment>
                ) : null}

              {['admin', 'custodian'].includes(
                authState.user.userType.toLowerCase()
              ) ? (
                  <Fragment>
                    <div
                      className={`${css(
                        styles.cardSize
                      )} card align-self-center text-center`}
                    >
                      <Link to={'/timesheet'} className={`card-link`}>
                        <div className="card-body">
                          <h5 className="card-title">
                            <HourglassEmptyIcon
                              fontSize="large"
                              className={css(styles.homeIconColor)}
                            />
                          </h5>
                          <p className={css(styles.CardtextIcon)}>Time Card</p>
                        </div>
                      </Link>
                    </div>
                  </Fragment>
                ) : null}

              {authState.user.userType === 'contractor' && (
                <Fragment>
                  <div
                    className={`${css(
                      styles.cardSize
                    )} card align-self-center text-center`}
                  >
                    <Link to={`/timesheet/${authState.user.id}`} className={`card-link`}>
                      <div className="card-body">
                        <h5 className="card-title">
                          <PlaylistAddCheckIcon
                            fontSize="large"
                            className={css(styles.homeIconColor)}
                          />
                        </h5>
                        <p className={css(styles.CardtextIcon)}>Time Card</p>
                      </div>
                    </Link>
                  </div>
                </Fragment>
              )}

              {['admin','resident','client'].includes(authState.user.userType.toLowerCase()) ? (
                <div
                  className={`${css(
                    styles.cardSize
                  )} card align-self-center text-center`}
                >
                  <Link to={{
                      pathname: '/referral',
                      state: {
                        from: 'ref'
                      }
                    }}>
                    <div className="card-body">
                      <h5 className="card-title">
                      <PeopleIcon fontSize="large" className={css(styles.homeIconColor)} />
                      </h5>
                      <p className={css(styles.CardtextIcon)}>Referrals</p>
                    </div>
                  </Link>
                </div>
              ) : null}

              {authState.user.userType === 'admin' && (
                <Fragment>
                  <div
                    className={`${css(
                      styles.cardSize
                    )} card align-self-center text-center`}
                  >
                    <Link to={'/todo'} className={`card-link`}>
                      <div className="card-body">
                        <h5 className="card-title">
                          <PlaylistAddCheckIcon
                            fontSize="large"
                            className={css(styles.homeIconColor)}
                          />
                        </h5>
                        <p className={css(styles.CardtextIcon)}>{'Todo'}</p>
                      </div>
                    </Link>
                  </div>
                  {/* Notes */}
                  <div
                    className={`${css(
                      styles.cardSize
                    )} card align-self-center text-center`}
                  >
                    <Link to={'/notes'} className={`card-link`}>
                      <div className="card-body">
                        <h5 className="card-title">
                          <NotesIcon
                            fontSize="large"
                            className={css(styles.homeIconColor)}
                          />
                        </h5>
                        <p className={css(styles.CardtextIcon)}>{'Notes'}</p>
                      </div>
                    </Link>
                  </div>
                </Fragment>
              )}

              {Boolean(authState.user.userType !== 'custodian') && (
                <div
                  className={`${css(
                    styles.cardSize
                  )} card align-self-center text-center`}
                >
                  <Link
                    to={
                      authState.user.userType === 'admin'
                        ? '/feedbacks'
                        : '/feedback'
                    }
                    className={`card-link`}
                  >
                    <div className="card-body">
                      <h5 className="card-title">
                        <FeedbackIcon
                          fontSize="large"
                          className={css(styles.homeIconColor)}
                        />
                      </h5>
                      <p className={css(styles.CardtextIcon)}>{'Feedback'}</p>
                    </div>
                  </Link>
                </div>
              )}

              {Boolean(authState.user.userType !== 'custodian') && (
                <div
                  className={`${css(
                    styles.cardSize
                  )} card align-self-center text-center`}
                >
                  <Link
                    to={{
                      pathname:
                        authState.user.userType === 'admin'
                          ? '/messages'
                          : `/message/${authState.user.id}`,
                      state: {
                        clientName: authState.user.name,
                        clientNumber: authState.user.phoneNumber,
                        from: 'home'
                      }
                    }}
                    className={`card-link`}
                  >
                    <div className="card-body">
                      <h5 className="card-title">
                        <ForumIcon
                          fontSize="large"
                          className={css(styles.homeIconColor)}
                        />
                      </h5>
                      <p className={css(styles.CardtextIcon)}>
                        {authState.user.userType === 'admin'
                          ? 'SMS'
                          : 'My Messages'}
                      </p>
                    </div>
                  </Link>
                </div>
              )}
              {Boolean(authState.user.userType === 'custodian') && (
                <div
                  className={`${css(
                    styles.cardSize
                  )} card align-self-center text-center`}
                >
                  <a href={`tel:${ponisoNumber}`}>
                    <div className="card-body">
                      <h5 className="card-title">
                        <CallIcon
                          className={css(styles.homeIconColor)}
                          fontSize="large"
                        />
                      </h5>
                      <p className={css(styles.CardtextIcon)}>Call Manager</p>
                    </div>
                  </a>
                </div>
              )}

              {['admin', 'client', 'resident'].includes(
                authState.user.userType.toLowerCase()
              ) ? (
                  <Fragment>
                    <div
                      className={`${css(
                        styles.cardSize
                      )} card align-self-center text-center`}
                    >
                      <Link to={'/'}
                        id="crfl"
                        onClick={() => window.open(`https://docs.google.com/forms/d/e/1FAIpQLSeC663sLzKdpxzaqzY2gdGAT5fe-Uc8lvLi1V7KdLfrralyeA/viewform?entry.568472638=${userData.name.replace(/\s+/g, '+')}&entry.1055458143=${userData.phoneNumber ? userData.phoneNumber : ""}`, '_blank')}
                        className={`card-link`}>
                        <div className="card-body">
                          <h5 className="card-title">
                            <ListAltIcon
                              fontSize="large"
                              className={css(styles.homeIconColor)}
                            />
                          </h5>
                          <p className={css(styles.CardtextIcon)}>Client Request Form</p>
                        </div>
                      </Link>
                    </div>
                  </Fragment>
                ) : null}
            </div>
          </div>
        </div>
        <Footer position="5vh" />
        <SocialMediaLinks />
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  inputGroup: {
    position: 'relative'
  },
  input: {
    marginTop: '1em',
    padding: '0.5em 1em 0.5em 2em',
    height: 40,
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
    top: 26,
    bottom: '4px',
    'z-index': 9
  },
  bellIcon: {
    color: '#25c0b0'
  },
  scanIcon: {
    position: 'absolute',
    top: 26,
    bottom: 4,
    right: 5,
    width: 20
  },
  homeIconColor: {
    color: '#25c0b0',
  },
  CardtextIcon: {
    marginTop: '15.5%'
  },
  CardtextImg: {
    marginTop: '21%'
  },
  cardSize: {
    width: 200,
    height: 154
  }
})
