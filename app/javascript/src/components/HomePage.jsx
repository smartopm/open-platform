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
import { useTranslation } from 'react-i18next'
import Card, { SVGIcon } from './Card'

import SocialMediaLinks from './SocialMediaLinks'
import { ponisoNumber } from '../utils/constants'
import QRIcon from '../../../assets/images/icon_qr_card_fill_copy.svg'
import { Footer } from './Footer'
import AccountManagement from '../../../assets/images/account_management.svg'
import NewsIcon from '../../../assets/images/iconfinder.svg'
import ActionFlowIcon from './ActionFlows/ActionFlowIcon'

export default function Homepage({ authState }) {
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
      icon: <SVGIcon image={QRIcon} alt="support icon" />,
      access: ['custodian']
    },
    {
      card_id: 2,
      title: t('dashboard.my_id_card'),
      path: `/id/${authState.user.id}`,

      icon: <PersonIcon fontSize="large" />,
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
      icon: <AccountCircleIcon fontSize="large" />,
      access: ['resident', 'client']
    },
    {
      card_id: 4,
      title: t('common:misc.users'),
      path: '/users',

      icon: <RecentActorsIcon fontSize="large" />,
      access: ['admin']
    },
    {
      card_id: 18,
      title: `${authState.user.community.name} ${t('common:misc.news')}`,
      path: '/news',
      titleStyle: css(styles.CardtextImg),
      icon: <SVGIcon image={NewsIcon} alt=" news icons" />,
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
      icon: <ForumIcon fontSize="large" />,
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

      icon: <TelegramIcon fontSize="large" />,
      access: ['admin']
    },
    {
      card_id: 8,
      title: t('common:misc.tasks'),
      path: '/tasks',

      icon: <PlaylistAddCheckIcon fontSize="large" />,
      access: ['admin']
    },
    {
      card_id: 9,
      title: t('common:misc.notes'),
      path: '/notes',

      icon: <NotesIcon fontSize="large" />,
      access: ['admin']
    },
    {
      card_id: 10,
      title: t('dashboard.my_thebe_portal'),
      path: '/account',
      titleStyle: css(styles.CardtextImg),
      clientName: authState.user.name,
      from: 'home',
      icon: <SVGIcon image={AccountManagement} alt="account management icon" />,
      access: ['admin', 'resident', 'client']
    },
    {
      card_id: 11,
      title: t('common:misc.request_forms'),
      path: '/forms',
      id: 'crfl',
      icon: <ListAltIcon fontSize="large" />,
      access: ['admin', 'resident', 'client']
    },
    {
      card_id: 12,
      title: t('common:misc.time_card'),
      path: '/timesheet',

      icon: <HourglassEmptyIcon fontSize="large" />,
      access: ['admin', 'custodian']
    },
    {
      card_id: 13,
      title: t('common:misc.log_book'),
      path: '/entry_logs',

      icon: <LogIcon fontSize="large" />,
      access: ['security_guard', 'admin']
    },
    {
      card_id: 14,
      title: t('common:misc.referrals'),
      path: '/referral',
      from: 'ref',
      icon: <PeopleIcon fontSize="large" />,
      access: ['admin', 'resident', 'client']
    },
    {
      card_id: 16,
      title: t('common:misc.time_card'),
      path: `/timesheet/${authState.user.id}`,

      icon: <PlaylistAddCheckIcon fontSize="large" />,
      access: ['contractor']
    },
    {
      card_id: 17,
      children: (
        <a href={`tel:${ponisoNumber}`}>
          <div className="card-body">
            <h5 className="card-title">
              <CallIcon fontSize="large" />
            </h5>
            <p className={css(styles.CardtextIcon)}>{t('dashboard.call_manager')}</p>
          </div>
        </a>
      ),
      access: ['contractor']
    },
    {
      title: t('common:misc.discussions'),
      path: '/discussions',
      titleStyle: css(styles.CardtextImg),
      icon: <MessageIcon fontSize="large" />,
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
      card_id: 19,
      title: t('common:misc.business'),
      path: '/business',
      titleStyle: css(styles.CardtextImg),
      icon: <LocalMallIcon fontSize="large" />,
      access: ['admin', 'client', 'prospective_client', 'resident', 'visitor']
    },
    {
      title: `${authState.user.community.name} ${t('common:misc.support')}`,
      path: '/contact',

      icon: <HelpIcon fontSize="large" />,
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
      icon: <LabelIcon fontSize="large" />,
      access: ['admin']
    },
    {
      title: t('common:misc.comments'),
      path: '/comments',
      icon: <CommentIcon fontSize="large" />,
      access: ['admin']
    },
    {
      title: t('common:misc.action_flows'),
      path: '/action_flows',
      icon: <ActionFlowIcon />,
      access: ['admin']
    },
    {
      title: t('common:misc.properties'),
      path: '/land_parcels',
      icon: <LandscapeIcon fontSize="large" />,
      access: ['admin']
    },
    {
      title: t('common:misc.payments'),
      path: '/payments',
      icon: <PaymentIcon fontSize="large" />,
      access: ['admin']
    },
    {
      title: t('common:misc.mail_templates'),
      path: '/mail_templates',
      icon: <MailOutline fontSize="large" />,
      access: ['admin']
    },
    {
      title: t('common:misc.comm_settings'),
      path: '/community',
      icon: <SettingsIcon fontSize="large" />,
      access: ['admin']
    }
  ]

  return (
    <div>
      <div className="container">
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
                  id={card.id}
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
  homeIconColor: {
    color: '#69ABA4'
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
