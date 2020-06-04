import React from 'react'
import { Redirect } from 'react-router-dom'
import { StyleSheet, css } from 'aphrodite'
import { useTranslation } from 'react-i18next'
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
import ListAltIcon from '@material-ui/icons/ListAlt'
import RecentActorsIcon from '@material-ui/icons/RecentActors'
import Card from '../components/Card'

export default function Homepage({ authState }) {
  const { t } = useTranslation()
  if (authState.user.userType === 'security_guard') {
    return <Redirect push to="/guard_home" />
  }
  const cards = [
    {
      card_id: 1,
      title: t('home.scan'),
      path: `/scan`,
      titleStyle: css(styles.CardtextImg),
      icon: <img src={QRIcon} alt="support icon" />,
      access: ['custodian']
    },
    {
      card_id: 2,
      title: t('My ID Card'),
      path: `/id/${authState.user.id}`,
      titleStyle: css(styles.CardtextIcon),
      icon: (
        <PersonIcon fontSize="large" className={css(styles.homeIconColor)} />
      ),
      access: [
        'admin',
        'client',
        'security_guard',
        'custodian',
        'prospective_client',
        'contractor',
        'resident',
        'visitor'
      ]
    },
    {
      card_id: 3,
      title: 'My Account',
      path: `/myaccount/${authState.user.id}`,
      titleStyle: css(styles.CardtextIcon),
      icon: (
        <AccountCircleIcon
          fontSize="large"
          className={css(styles.homeIconColor)}
        />
      ),
      access: ['resident', 'client']
    },
    {
      card_id: 4,
      title: 'Users',
      path: `/users`,
      titleStyle: css(styles.CardtextIcon),
      icon: (
        <RecentActorsIcon
          fontSize="large"
          className={css(styles.homeIconColor)}
        />
      ),
      access: ['admin']
    },
    {
      card_id: 5,
      title: `${authState.user.community.name} News`,
      path: `/news`,
      titleStyle: css(styles.CardtextImg),
      icon: (
        <img
          src={NewsIcon}
          className={css(styles.homeIconColor)}
          alt=" news icons"
        />
      ),
      access: [
        'admin',
        'client',
        'security_guard',
        'prospective_client',
        'contractor',
        'resident',
        'visitor'
      ]
    },
    {
      card_id: 6,
      title: 'My Messages',
      path:
        authState.user.userType === 'admin'
          ? '/messages'
          : `/message/${authState.user.id}`,
      titleStyle: css(styles.CardtextIcon),
      clientName: authState.user.name,
      clientNumber: authState.user.phoneNumber,
      from: 'home',
      icon: (
        <ForumIcon fontSize="large" className={css(styles.homeIconColor)} />
      ),
      access: [
        'admin',
        'client',
        'security_guard',
        'prospective_client',
        'contractor',
        'resident',
        'visitor'
      ]
    },
    {
      card_id: 7,
      title: 'Tasks',
      path: `/todo`,
      titleStyle: css(styles.CardtextIcon),
      icon: (
        <PlaylistAddCheckIcon
          fontSize="large"
          className={css(styles.homeIconColor)}
        />
      ),
      access: ['admin']
    },
    {
      card_id: 8,
      title: 'Notes',
      path: `/notes`,
      titleStyle: css(styles.CardtextIcon),
      icon: (
        <NotesIcon fontSize="large" className={css(styles.homeIconColor)} />
      ),
      access: ['admin']
    },
    {
      card_id: 9,
      title: 'My Thebe Portal',
      path: `/account`,
      titleStyle: css(styles.CardtextImg),
      clientName: authState.user.name,
      from: 'home',
      icon: (
        <img
          src={AccountManagement}
          className={css(styles.homeIconColor)}
          alt="account management icon"
        />
      ),
      access: ['admin', 'resident', 'client']
    },
    {
      card_id: 10,
      title: 'Client Request Form',
      path: `/`,
      id: 'crfl',
      titleStyle: css(styles.CardtextIcon),
      handleClick: () =>
        window.open(
          `https://docs.google.com/forms/d/e/1FAIpQLSeC663sLzKdpxzaqzY2gdGAT5fe-Uc8lvLi1V7KdLfrralyeA/viewform?entry.568472638=${authState.user.name.replace(
            /\s+/g,
            '+'
          )}&entry.1055458143=${
            authState.user.phoneNumber ? authState.user.phoneNumber : ''
          }`,
          '_blank'
        ),
      icon: (
        <ListAltIcon fontSize="large" className={css(styles.homeIconColor)} />
      ),
      access: ['admin', 'resident', 'client']
    },
    {
      card_id: 11,
      title: 'Time Card',
      path: `/timesheet`,
      titleStyle: css(styles.CardtextIcon),
      icon: (
        <HourglassEmptyIcon
          fontSize="large"
          className={css(styles.homeIconColor)}
        />
      ),
      access: ['admin', 'custodian']
    },
    {
      card_id: 12,
      title: 'Log Book',
      path: `/entry_logs`,
      titleStyle: css(styles.CardtextIcon),
      icon: <LogIcon fontSize="large" className={css(styles.homeIconColor)} />,
      access: ['security_guard', 'admin']
    },
    {
      card_id: 13,
      title: 'Referrals',
      path: `/referral`,
      titleStyle: css(styles.CardtextIcon),
      icon: <LogIcon fontSize="large" className={css(styles.homeIconColor)} />,
      access: ['admin', 'resident', 'client']
    },
    {
      card_id: 14,
      title: `${authState.user.community.name} Support`,
      path: `/contact`,
      titleStyle: css(styles.CardtextIcon),
      icon: <HelpIcon fontSize="large" className={css(styles.homeIconColor)} />,
      access: [
        'admin',
        'client',
        'security_guard',
        'prospective_client',
        'contractor',
        'resident',
        'visitor'
      ]
    },
    {
      card_id: 15,
      title: `Time Card`,
      path: `/timesheet/${authState.user.id}`,
      titleStyle: css(styles.CardtextIcon),
      icon: (
        <PlaylistAddCheckIcon
          fontSize="large"
          className={css(styles.homeIconColor)}
        />
      ),
      access: ['contractor']
    },
    {
      card_id: 16,
      children: (
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
      ),
      access: ['contractor']
    }
  ]

  return (
    <div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-4-lg col-12-sm index-cards">
            <div className="d-flex flex-row flex-wrap justify-content-center mb-3">
              {cards.map(card => (
                <Card
                  key={card.card_id}
                  path={card.path}
                  title={card.title}
                  titleStyle={css(styles.CardtextImg)}
                  icon={card.icon}
                  access={card.access}
                  authState={authState} >
                {card.children}
                </Card>
              ))}
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
