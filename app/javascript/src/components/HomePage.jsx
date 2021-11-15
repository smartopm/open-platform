/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-use-before-define */
import React from 'react'
import { Redirect } from 'react-router-dom'
import { StyleSheet, css } from 'aphrodite'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import HelpIcon from '@material-ui/icons/Help'
import PersonIcon from '@material-ui/icons/Person'
import LabelIcon from '@material-ui/icons/Label'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import LogIcon from '@material-ui/icons/Assignment'
import MessageIcon from '@material-ui/icons/Message'
import NotesIcon from '@material-ui/icons/Notes'
import SettingsIcon from '@material-ui/icons/Settings';
import ForumIcon from '@material-ui/icons/Forum'
import CallIcon from '@material-ui/icons/Call'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import CommentIcon from '@material-ui/icons/Comment'
import LocalMallIcon from '@material-ui/icons/LocalMall'
import ListAltIcon from '@material-ui/icons/ListAlt'
import RecentActorsIcon from '@material-ui/icons/RecentActors'
import PeopleIcon from '@material-ui/icons/People'
import TelegramIcon from '@material-ui/icons/Telegram'
import LandscapeIcon from '@material-ui/icons/Landscape';
import PaymentIcon from '@material-ui/icons/Payment';
import MailOutline from '@material-ui/icons/MailOutline';
import SelectAll from '@material-ui/icons/SelectAll'
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import { useTranslation } from 'react-i18next'
import Card from './Card'
import QuickLinks from '../modules/QuickLinks/Components/QuickLinks';
import SocialMediaLinks from './SocialMediaLinks'
import { Footer } from './Footer'

// This should be deprecated in favour of the new dashboard
export default function Homepage({ authState, quickLinks }) {
  const { t } = useTranslation('dashboard')
  if (authState.user.userType === 'security_guard') {
    return <Redirect push to="/guard_home" />
  }

  const cards = [
    {
      card_id: 1,
      title: t('dashboard.scan'),
      path: '/scan',
      titleStyle: css(styles.CardtextImg),
      icon: <SelectAll color="primary" fontSize="large" />,
      access: ['custodian']
    },
    {
      card_id: 2,
      title: t('dashboard.my_id_card'),
      path: `/id/${authState.user.id}`,

      icon: <PersonIcon color="primary" fontSize="large" />,
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
      title: t('dashboard.my_account'),
      path: `/myaccount/${authState.user.id}`,
      from: 'acc',
      icon: <AccountCircleIcon color="primary" fontSize="large" />,
      access: ['resident', 'client']
    },
    {
      card_id: 4,
      title: t('common:misc.users'),
      path: '/users',

      icon: <RecentActorsIcon color="primary" fontSize="large" />,
      access: ['admin']
    },
    {
      card_id: 18,
      title: `${authState.user.community.name} ${t('common:misc.news')}`,
      path: '/news',
      titleStyle: css(styles.CardtextImg),
      icon: <LibraryBooksIcon color="primary" fontSize="large" />,
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
      title: t('dashboard.my_messages'),
      path:
        authState.user.userType === 'admin'
          ? '/messages'
          : `/message/${authState.user.id}`,
      clientName: authState.user.name,
      clientNumber: authState.user.phoneNumber,
      from: 'home',
      icon: <ForumIcon color="primary" fontSize="large" />,
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
      title: t('common:misc.campaigns'),
      path: '/campaigns',

      icon: <TelegramIcon color="primary" fontSize="large" />,
      access: ['admin']
    },
    {
      card_id: 8,
      title: t('common:misc.tasks'),
      path: '/tasks',

      icon: <PlaylistAddCheckIcon color="primary" fontSize="large" />,
      access: ['admin']
    },
    {
      card_id: 9,
      title: t('common:misc.notes'),
      path: '/notes',

      icon: <NotesIcon color="primary" fontSize="large" />,
      access: ['admin']
    },
    {
      card_id: 10,
      title: t('dashboard.my_thebe_portal'),
      path: '/account',
      titleStyle: css(styles.CardtextImg),
      clientName: authState.user.name,
      from: 'home',
      icon: <HomeWorkIcon color="primary" fontSize="large" />,
      access: ['admin', 'resident', 'client'],
      communityName: authState.user,
    },
    {
      card_id: 11,
      title: t('common:misc.request_forms'),
      path: '/forms',
      id: 'crfl',
      icon: <ListAltIcon color="primary" fontSize="large" />,
      access: ['admin', 'resident', 'client']
    },
    {
      card_id: 12,
      title: t('common:misc.time_card'),
      path: '/timesheet',

      icon: <HourglassEmptyIcon color="primary" fontSize="large" />,
      access: ['admin', 'custodian']
    },
    {
      card_id: 13,
      title: t('common:misc.log_book'),
      path: '/logbook',

      icon: <LogIcon color="primary" fontSize="large" />,
      access: ['security_guard', 'admin']
    },
    {
      card_id: 14,
      title: t('common:misc.referrals'),
      path: '/referral',
      from: 'ref',
      icon: <PeopleIcon color="primary" fontSize="large" />,
      access: ['admin', 'resident', 'client']
    },
    {
      card_id: 16,
      title: t('common:misc.time_card'),
      path: `/timesheet/${authState.user.id}`,

      icon: <PlaylistAddCheckIcon color="primary" fontSize="large" />,
      access: ['contractor', 'site_worker']
    },
    {
      card_id: 17,
      children: (
        <a href={`tel:${authState.user.community.securityManager}`}>
          <div className="card-body">
            <h5 className="card-title">
              <CallIcon color="primary" fontSize="large" />
            </h5>
            <p className={css(styles.CardtextIcon)}>{t('dashboard.call_manager')}</p>
          </div>
        </a>
      ),
      access: ['contractor', 'site_worker']
    },
    {
      title: t('common:misc.discussions'),
      path: '/discussions',
      titleStyle: css(styles.CardtextImg),
      icon: <MessageIcon color="primary" fontSize="large" />,
      access: [
        'admin',
        'client',
        'security_guard',
        'prospective_client',
        'contractor',
        'resident',
        'visitor',
        'site_worker'
      ]
    },

    {
      card_id: 19,
      title: t('common:misc.business'),
      path: '/businesses',
      titleStyle: css(styles.CardtextImg),
      icon: <LocalMallIcon color="primary" fontSize="large" />,
      access: ['admin', 'client', 'prospective_client', 'resident', 'visitor']
    },
    {
      title: `${authState.user.community.name} ${t('common:misc.support')}`,
      path: '/contact',

      icon: <HelpIcon color="primary" fontSize="large" />,
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
      title: t('common:misc.labels'),
      path: `/labels`,
      icon: <LabelIcon color="primary" fontSize="large" />,
      access: ['admin']
    },
    {
      title: t('common:misc.comments'),
      path: '/comments',
      icon: <CommentIcon color="primary" fontSize="large" />,
      access: ['admin']
    },
    {
      title: t('common:misc.properties'),
      path: '/land_parcels',
      icon: <LandscapeIcon color="primary" fontSize="large" />,
      access: ['admin']
    },
    {
      title: t('common:misc.payments'),
      path: '/payments',
      icon: <PaymentIcon color="primary" fontSize="large" />,
      access: ['admin']
    },
    {
      title: t('common:misc.mail_templates'),
      path: '/mail_templates',
      icon: <MailOutline color="primary" fontSize="large" />,
      access: ['admin']
    },
    {
      title: t('common:misc.comm_settings'),
      path: '/community',
      icon: <SettingsIcon color="primary" fontSize="large" />,
      access: ['admin']
    }
  ]

  return (
    <div>
      <div className="container">
        <div className={css(styles.QuickLinks)}>
          {
            authState.user.userType === 'resident' && (
              <QuickLinks menuItems={quickLinks} translate={t} />
            )
          }
        </div>
        <div className="row justify-content-center">
          <div className="col-4-lg col-12-sm index-cards">
            <div className="d-flex flex-row flex-wrap justify-content-center mb-3">
              {cards.map((card, index) => (
                <Card
                  key={index}
                  path={card.path}
                  title={card.title}
                  titleStyle={css(styles.CardtextImg)}
                  icon={card.icon}
                  from={card.from}
                  access={card.access}
                  authState={authState}
                  clientName={card.clientName}
                  clientNumber={card.clientNumber}
                  id={card.card_id}
                >
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
  CardtextIcon: {
    marginTop: '15.5%'
  },
  CardtextImg: {
    marginTop: '21%'
  },
  cardSize: {
    width: 200,
    height: 154
  },
  QuickLinks: {
    marginLeft: '2em'
  }
})
