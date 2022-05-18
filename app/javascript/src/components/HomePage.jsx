/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-use-before-define */
import React from 'react';
import { Redirect } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import HelpIcon from '@mui/icons-material/Help';
import PersonIcon from '@mui/icons-material/Person';
import LabelIcon from '@mui/icons-material/Label';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LogIcon from '@mui/icons-material/Assignment';
import MessageIcon from '@mui/icons-material/Message';
import NotesIcon from '@mui/icons-material/Notes';
import SettingsIcon from '@mui/icons-material/Settings';
import ForumIcon from '@mui/icons-material/Forum';
import CallIcon from '@mui/icons-material/Call';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CommentIcon from '@mui/icons-material/Comment';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import PeopleIcon from '@mui/icons-material/People';
import TelegramIcon from '@mui/icons-material/Telegram';
import LandscapeIcon from '@mui/icons-material/Landscape';
import PaymentIcon from '@mui/icons-material/Payment';
import MailOutline from '@mui/icons-material/MailOutline';
import SelectAll from '@mui/icons-material/SelectAll';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { useTranslation } from 'react-i18next';
import Card from './Card';
import QuickLinks from '../modules/QuickLinks/Components/QuickLinks';
import SocialMediaLinks from './SocialMediaLinks';
import { Footer } from './Footer';
import FeatureCheck from '../modules/Features';
import NewsFeed from '../modules/News/Components/NewsFeed';

// This should be deprecated in favour of the new dashboard
export default function Homepage({ authState, quickLinks }) {
  const guardPageUsers = ['security_guard', 'security_supervisor'];
  const { t } = useTranslation('dashboard');
  if (guardPageUsers.includes(authState.user.userType)) {
    return <Redirect push to="/guard_home" />;
  }
  // TODO: Find a better way to handle this routing
  if (authState.user.userType === 'code_scanner') {
    return <Redirect push to="/logbook/kiosk" />;
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
        'visitor',
        'site_worker',
        'site_manager',
        'security_supervisor',
        'consultant',
        'developer',
        'marketing_manager'
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
        'visitor',
        'security_supervisor',
        'developer',
        'marketing_manager'
      ]
    },
    {
      card_id: 6,
      title: t('dashboard.my_messages'),
      path: authState.user.userType === 'admin' ? '/messages' : `/message/${authState.user.id}`,
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
        'visitor',
        'security_supervisor',
        'developer',
        'marketing_manager'
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
      communityName: authState.user
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
      access: ['contractor', 'site_worker', 'site_manager', 'security_supervisor']
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
      access: ['contractor', 'site_worker', 'site_manager', 'security_supervisor']
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
        'site_worker',
        'site_manager',
        'security_supervisor',
        'developer',
        'marketing_manager'
      ]
    },

    {
      card_id: 19,
      title: t('common:misc.business'),
      path: '/businesses',
      titleStyle: css(styles.CardtextImg),
      icon: <LocalMallIcon color="primary" fontSize="large" />,
      access: ['admin', 'client', 'prospective_client', 'resident', 'visitor', 'marketing_manager']
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
        'visitor',
        'developer',
        'marketing_manager'
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
  ];

  return (
    <div>
      <div>
        <div>
          {authState.user.userType === 'resident' && (
            <QuickLinks menuItems={quickLinks} translate={t} />
          )}
        </div>
        <div className="row" style={{ marginLeft: '20PX'}}>
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
        <FeatureCheck features={authState.user.community.features} name="News">
          <NewsFeed wordpressEndpoint={authState.user?.community.wpLink} />
        </FeatureCheck>
        <Footer position="5vh" />
        <SocialMediaLinks />
      </div>
    </div>
  );
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
});
