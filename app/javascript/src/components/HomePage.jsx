import React from 'react';
import { Redirect } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import HomePageCard from './Card';
import QuickLinks from '../modules/QuickLinks/Components/QuickLinks';
import SocialMediaLinks from './SocialMediaLinks';
import { Footer } from './Footer';
import FeatureCheck from '../modules/Features';
import NewsFeed from '../modules/News/Components/NewsFeed';

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
      access: ['custodian'],
    },
    {
      card_id: 2,
      title: t('dashboard.my_id_card'),
      path: `/id/${authState.user.id}`,
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
        'marketing_manager',
      ],
    },
    {
      card_id: 3,
      title: t('dashboard.my_account'),
      path: `/myaccount/${authState.user.id}`,
      from: 'acc',
      access: ['resident', 'client'],
    },
    {
      card_id: 4,
      title: t('common:misc.users'),
      path: '/users',
      access: ['admin'],
    },
    {
      card_id: 18,
      title: `${authState.user.community.name} ${t('common:misc.news')}`,
      path: '/news',
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
        'marketing_manager',
      ],
    },
    {
      card_id: 6,
      title: t('dashboard.my_messages'),
      path: authState.user.userType === 'admin' ? '/messages' : `/message/${authState.user.id}`,
      clientName: authState.user.name,
      clientNumber: authState.user.phoneNumber,
      from: 'home',
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
        'marketing_manager',
      ],
    },
    {
      card_id: 7,
      title: t('common:misc.campaigns'),
      path: '/campaigns',
      access: ['admin'],
    },
    {
      card_id: 8,
      title: t('common:misc.tasks'),
      path: '/tasks',
      access: ['admin'],
    },
    {
      card_id: 9,
      title: t('common:misc.notes'),
      path: '/notes',
      access: ['admin'],
    },
    {
      card_id: 10,
      title: t('dashboard.my_thebe_portal'),
      path: '/account',
      clientName: authState.user.name,
      from: 'home',
      access: ['admin', 'resident', 'client'],
      communityName: authState.user,
    },
    {
      card_id: 11,
      title: t('common:misc.request_forms'),
      path: '/forms',
      id: 'crfl',
      access: ['admin', 'resident', 'client'],
    },
    {
      card_id: 12,
      title: t('common:misc.time_card'),
      path: '/timesheet',
      access: ['admin', 'custodian'],
    },
    {
      card_id: 13,
      title: t('common:misc.log_book'),
      path: '/logbook',
      access: ['security_guard', 'admin'],
    },
    {
      card_id: 14,
      title: t('common:misc.referrals'),
      path: '/referral',
      from: 'ref',
      access: ['admin', 'resident', 'client'],
    },
    {
      card_id: 16,
      title: t('common:misc.time_card'),
      path: `/timesheet/${authState.user.id}`,
      access: ['contractor', 'site_worker', 'site_manager', 'security_supervisor'],
    },
    {
      card_id: 17,
      children: (
        <a href={`tel:${authState.user.community.securityManager}`}>
          {t('dashboard.call_manager')}
        </a>
      ),
      access: ['contractor', 'site_worker', 'site_manager', 'security_supervisor'],
    },
    {
      card_id: 5,
      title: t('common:misc.discussions'),
      path: '/discussions',
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
        'marketing_manager',
      ],
    },

    {
      card_id: 19,
      title: t('common:misc.business'),
      path: '/businesses',
      titleStyle: css(styles.CardtextImg),
      access: ['admin', 'client', 'prospective_client', 'resident', 'visitor', 'marketing_manager'],
    },
    {
      card_id: 15,
      title: `${authState.user.community.name} ${t('common:misc.support')}`,
      path: '/contact',
      access: [
        'admin',
        'client',
        'security_guard',
        'prospective_client',
        'contractor',
        'resident',
        'visitor',
        'developer',
        'marketing_manager',
      ],
    },
    {
      card_id: 20,
      title: t('common:misc.labels'),
      path: `/labels`,
      access: ['admin'],
    },
    {
      card_id: 21,
      title: t('common:misc.comments'),
      path: '/comments',
      access: ['admin'],
    },
    {
      card_id: 22,
      title: t('common:misc.properties'),
      path: '/land_parcels',
      access: ['admin'],
    },
    {
      card_id: 23,
      title: t('common:misc.payments'),
      path: '/payments',
      access: ['admin'],
    },
    {
      card_id: 24,
      title: t('common:misc.mail_templates'),
      path: '/mail_templates',
      access: ['admin'],
    },
    {
      card_id: 25,
      title: t('common:misc.comm_settings'),
      path: '/community',
      access: ['admin'],
    },
  ];

  return (
    <div>
      <div>
        <div>
          {['resident', 'lead'].includes(authState.user.userType) && (
            <QuickLinks menuItems={quickLinks} translate={t} />
          )}
        </div>
        <FeatureCheck features={authState.user.community.features} name="News">
          <NewsFeed wordpressEndpoint={authState.user?.community.wpLink} />
        </FeatureCheck>
        <Grid container spacing={2} sx={{ mt: 3 }}>
          {cards.map((card) => (
            <HomePageCard
              key={card.card_id}
              path={card.path}
              title={card.title}
              icon={card.icon}
              from={card.from}
              access={card.access}
              authState={authState}
              clientName={card.clientName}
              clientNumber={card.clientNumber}
              id={card.card_id}
            >
              {card.children}
            </HomePageCard>
          ))}
        </Grid>
        <Footer position="5vh" />
        <SocialMediaLinks />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  CardtextImg: { marginTop: '21%' },
  cardSize: {
    width: 200,
    height: 154
  }
});
Homepage.propTypes = {
  authState: PropTypes.shape(PropTypes.Object).isRequired,
  quickLinks: PropTypes.arrayOf(
    PropTypes.shape({
      menu_name: PropTypes.string,
      menu_link: PropTypes.string
    })
  ).isRequired
};
