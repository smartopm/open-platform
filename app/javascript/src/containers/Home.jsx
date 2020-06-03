import React, { useContext, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { StyleSheet, css } from 'aphrodite'
import { useTranslation } from 'react-i18next'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'
import Nav from '../components/Nav'
import Loading from '../components/Loading.jsx'
import ScanIcon from '../../../assets/images/shape.svg'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import HelpIcon from '@material-ui/icons/Help'
import NewsIcon from '../../../assets/images/iconfinder.svg'
import AccountManagement from '../../../assets/images/account_management.svg'
import PersonIcon from '@material-ui/icons/Person'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import LogIcon from '@material-ui/icons/Assignment'
import NotesIcon from '@material-ui/icons/Notes'
import ForumIcon from '@material-ui/icons/Forum'
import { Footer } from '../components/Footer.jsx'
import QRIcon from '../../../assets/images/icon_qr_card_fill_copy.svg'
import { ponisoNumber } from '../utils/constants.js'
import CallIcon from '@material-ui/icons/Call'
import SocialMediaLinks from '../components/SocialMediaLinks.jsx'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import PeopleIcon from '@material-ui/icons/People'
import ListAltIcon from '@material-ui/icons/ListAlt'
import RecentActorsIcon from '@material-ui/icons/RecentActors'
import Card from '../components/Card'
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

              {Boolean(authState.user.userType === 'custodian') && (
                <Card
                  path={`/scan`}
                  title={t('home.scan')}
                  titleStyle ={css(styles.CardtextImg)}
                  icon={<img src={QRIcon} alt="support icon" />}
                />
              )}
              <Card
                path={`/id/${authState.user.id}`}
                title={t('My ID Card')}
                titleStyle ={css(styles.CardtextIcon)}
                icon={
                  <PersonIcon
                    fontSize="large"
                    className={css(styles.homeIconColor)}
                  />
                }
              />
              {/* Boolean(authState.user.userType !== 'custodian') */}
              {Boolean(authState.user.userType !== 'custodian') && (
                <Card
                  path={'/contact'}
                  title={`${authState.user.community.name} Support`}
                  titleStyle ={css(styles.CardtextIcon)}
                  icon={
                    <HelpIcon
                      fontSize="large"
                      className={css(styles.homeIconColor)}
                    />
                  }
                />
              )}
              {Boolean(authState.user.userType !== 'custodian') && (
                <Card
                  path={`/news`}
                  title={`${authState.user.community.name} News`}
                  titleStyle ={css(styles.CardtextImg)}
                  icon={
                    <img
                      src={NewsIcon}
                      className={css(styles.homeIconColor)}
                      alt=" news icons"
                    />
                  }
                />
              )}

              {['admin'].includes(authState.user.userType.toLowerCase()) ? (
                <Card
                  path={'/users'}
                  title={'Users'}
                  titleStyle ={css(styles.CardtextIcon)}
                  icon={
                    <RecentActorsIcon
                      fontSize="large"
                      className={css(styles.homeIconColor)}
                    />
                  }
                />
              ) : null}

              {['resident', 'client'].includes(
                authState.user.userType.toLowerCase()
              ) ? (
                <Card
                  path={`/myaccount/${authState.user.id}`}
                  title={'My Account'}
                  titleStyle ={css(styles.CardtextIcon)}
                  icon={
                    <AccountCircleIcon
                      fontSize="large"
                      className={css(styles.homeIconColor)}
                    />
                  }
                />
              ) : null}

              {['admin', 'resident', 'client'].includes(
                authState.user.userType.toLowerCase()
              ) ? (
                <Card
                  path={`/account'`}
                  title={'My Thebe Portal'}
                  clientName={authState.user.name}
                  titleStyle ={css(styles.CardtextImg)}
                  from={'home'}
                  icon={
                    <img
                      src={AccountManagement}
                      className={css(styles.homeIconColor)}
                      alt="account management icon"
                    />
                  }
                />
              ) : null}

              {['security_guard', 'admin'].includes(
                authState.user.userType.toLowerCase()
              ) ? (
                <Card
                  path={'/entry_logs'}
                  title={'Log Book'}
                  titleStyle ={css(styles.CardtextIcon)}
                  icon={
                    <LogIcon
                      fontSize="large"
                      className={css(styles.homeIconColor)}
                    />
                  }
                />
              ) : null}

              {['admin', 'custodian'].includes(
                authState.user.userType.toLowerCase()
              ) ? (
                <Card
                  path={'/timesheet'}
                  title={'Time Card'}
                  titleStyle ={css(styles.CardtextIcon)}
                  icon={
                    <HourglassEmptyIcon
                      fontSize="large"
                      className={css(styles.homeIconColor)}
                    />
                  }
                />
              ) : null}

              {authState.user.userType === 'contractor' && (
                <Card
                  path={`/timesheet/${authState.user.id}`}
                  title={'Time Card'}
                  titleStyle ={css(styles.CardtextIcon)}
                  icon={
                    <PlaylistAddCheckIcon
                      fontSize="large"
                      className={css(styles.homeIconColor)}
                    />
                  }
                />
              )}

              {['admin', 'resident', 'client'].includes(
                authState.user.userType.toLowerCase()
              ) ? (
                <Card
                  path={`/referral`}
                  title={'Referrals'}
                  titleStyle ={css(styles.CardtextIcon)}
                  icon={
                    <PeopleIcon
                      fontSize="large"
                      className={css(styles.homeIconColor)}
                    />
                  }
                  from="ref"
                />
              ) : null}

              {authState.user.userType === 'admin' && (
                <>
                  <Card
                    path={`/todo`}
                    title={'Todo'}
                    titleStyle ={css(styles.CardtextIcon)}
                    icon={
                      <PlaylistAddCheckIcon
                        fontSize="large"
                        className={css(styles.homeIconColor)}
                      />
                    }
                  />
                  <Card
                    path={`/notes`}
                    title={'Notes'}
                    titleStyle ={css(styles.CardtextIcon)}
                    icon={
                      <NotesIcon
                        fontSize="large"
                        className={css(styles.homeIconColor)}
                      />
                    }
                  />
                </>
              )}

              {Boolean(authState.user.userType !== 'custodian') && (
                <Card
                  path={
                    authState.user.userType === 'admin'
                      ? '/messages'
                      : `/message/${authState.user.id}`
                  }
                  title={ 'My Messages' }
                  titleStyle ={css(styles.CardtextIcon)}
                  clientName={authState.user.name}
                  clientNumber={authState.user.phoneNumber}
                  from={'home'}
                  icon={
                    <ForumIcon
                      fontSize="large"
                      className={css(styles.homeIconColor)}
                    />
                  }
                />
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
                <Card
                  path={`/`}
                  title={'Client Request Form'}
                  id="crfl"
                  titleStyle ={css(styles.CardtextIcon)}
                  handleClick={() =>
                    window.open(
                      `https://docs.google.com/forms/d/e/1FAIpQLSeC663sLzKdpxzaqzY2gdGAT5fe-Uc8lvLi1V7KdLfrralyeA/viewform?entry.568472638=${ authState.user.name.replace(
                        /\s+/g,
                        '+'
                      )}&entry.1055458143=${
                        authState.user.phoneNumber ? authState.user.phoneNumber : ''
                      }`,
                      '_blank'
                    )
                  }
                  icon={
                    <ListAltIcon
                      fontSize="large"
                      className={css(styles.homeIconColor)}
                    />
                  }
                />
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
    color: '#25c0b0'
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
