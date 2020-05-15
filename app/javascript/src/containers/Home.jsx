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
import PeopleIcon from '@material-ui/icons/People'

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
                        <p>{t('home.explore')}</p>
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
                      <p>{t('home.scan')}</p>
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
                      <PersonIcon className={css(styles.homeIconColor)} />
                    </h5>
                    <p>{t('home.identity')}</p>
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
                        <HelpIcon className={css(styles.homeIconColor)} />
                      </h5>
                      <p>{'Contact'}</p>
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
                          alt=""
                        />
                      </h5>
                      <p>News</p>
                    </div>
                  </Link>
                </div>
              )}

              {['admin','resident','client'].includes(authState.user.userType.toLowerCase()) ? (
                <div
                  className={`${css(
                    styles.cardSize
                  )} card align-self-center text-center`}
                >
                  <Link to="/account" className={`card-link`}>
                    <div className="card-body">
                      <h5 className="card-title">
                        <img
                          src={AccountManagement}
                          className={css(styles.homeIconColor)}
                          alt=""
                        />
                      </h5>
                      <p>My Thebe Portal</p>
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
                            <LogIcon className={css(styles.homeIconColor)} />
                          </h5>
                          <p>{'Log Book'}</p>
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
                            <LogIcon
                              fontSize="large"
                              className={css(styles.homeIconColor)}
                            />
                          </h5>
                          <p>Time Card</p>
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
                        <p>Time Card</p>
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
                  <Link to="/referrals" className={`card-link`}>
                    <div className="card-body">
                      <h5 className="card-title">
                      <PeopleIcon fontSize="large" className={css(styles.homeIconColor)} />
                      </h5>
                      <p>Referrals</p>
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
                        <p>{'Todo'}</p>
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
                        <p>{'Notes'}</p>
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
                      <p>{'Feedback'}</p>
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
                      <p>
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
                      Call Manager
                    </div>
                  </a>
                </div>
              )}

              { ['admin', 'client', 'resident'].includes(
                authState.user.userType.toLowerCase()
              ) ? (
                <Fragment>
                  <div
                    className={`${css(
                      styles.cardSize
                    )} card align-self-center text-center`}
                  >
                    <Link to={'/'} 
                      onClick={() => window.open('https://forms.gle/Sdbj91Sia8EpDJiN6', '_blank')}
                      className={`card-link`}>
                      <div className="card-body">
                        <h5 className="card-title">
                          <ListAltIcon
                            fontSize="large"
                            className={css(styles.homeIconColor)}
                          />
                        </h5>
                        <p>Client Request Form</p>
                      </div>
                    </Link>
                  </div>
                </Fragment>
              ): null}
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
    color: '#25c0b0'
  },
  cardSize: {
    width: 200,
    height: 154
  }
})
