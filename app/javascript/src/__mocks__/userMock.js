/**
 * use authstate.js instead of this
 * @deprecated in favour of ./authstate.js it seems most update to date with permissions
 */
const userMock = {
    user: {
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      token: 'a54d6184-b10e-4865-bee7',
      name: 'Another somebodyy',
      userType: 'client',
      expiresAt: null,
      community: {
        supportName: 'Support Officer',
        themeColors: {
          primaryColor: "#nnn",
          secondaryColor: "#nnn"
        },
        name: 'Another Comm',
        imageUrl: 'http://image.jpg',
        locale: 'en-ZM',
        currency: 'ZMW',
        id: "293849323829891",
        wpLink: "http://link.com",
        menuItems: [
          { menu_link: 'http://some-link.com', menu_name: 'Custom Menu', display_on: ['Menu', 'Dashboard'] },
        ],
        features: {},
        timezone: 'Africa/Maputo'
      }
    }
  };

  export default userMock;