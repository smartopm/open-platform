import { CurrentCommunityQuery } from '../modules/Community/graphql/community_query';

const currentCommunityMock = {
  request: {
    query: CurrentCommunityQuery
  },
  result: {
    data: {
      currentCommunity: {
        imageUrl: 'https://dev.dgdp.site/rails/active_storage/blobs/eyJ.png',
        id: '8d66a68a-ded4-4f95-b9e2-62811d2f395f',
        leadMonthlyTargets: [
          { division: 'Africa', target: '15' },
          { division: 'China', target: '15' }
        ],
        name: 'Test Community',
        supportEmail: [{ email: 'support@test.com', category: 'customer_care' }],
        supportWhatsapp: [{ email: 'support@test.com', category: 'customer_care' }],
        supportNumber: [{ email: 'support@test.com', category: 'customer_care' }],
        currency: 'kwacha',
        locale: 'en-ZM',
        gaId: 'G-KAIADJQ',
        tagline: 'This is a tagline for this community',
        logoUrl: '',
        language: 'en-US',
        features: { Dashboard: { features: [] } },
        socialLinks: null,
        menuItems: null,
        wpLink: 'http://wp.com',
        themeColors: null,
        securityManager: null,
        templates: null,
        subAdministrator: null,
        bankingDetails: null,
        smsPhoneNumbers: null,
        emergencyCallNumber: null
      }
    }
  }
};

export default currentCommunityMock;
