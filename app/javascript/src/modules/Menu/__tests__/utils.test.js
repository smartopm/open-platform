import checkSubMenuAccessibility, {canAccessSOS } from '../utils'
import authState from '../../../__mocks__/authstate';

describe('Menu items check', () => {

  const subMenuItem = {
    moduleName: 'note',
    accessibleBy: ['admin']

  }


  const subMenuItemWithoutModuleName = {
    accessibleBy: ['admin']
  }

  const authStateWithoutPermissions = {
    user: {
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      name: 'Another somebodyy',
      userType: 'admin',
      expiresAt: null,
      community: {
        features: {Tasks: { features: [] }},
        name: 'City',
        logoUrl: 'http://image.jpg',
        smsPhoneNumbers: ["+254724821901", "+154724582391"],
        emergencyCallNumber: "254724821901",
      },
      permissions: [          
         {
           module: "note",
           permissions: ['can_create_note', 'can_get_task_count']
          },
         ]
    }
  };


  it('returns true if user has all allowed permissions to see menu item', () => {
    const canSeeMenuItem = checkSubMenuAccessibility({authState, subMenuItem});

    expect(canSeeMenuItem).toEqual(true);
  });

  it('returns false if user does not have permissions', () => {
    const canSeeMenuItem = checkSubMenuAccessibility({authState: authStateWithoutPermissions, subMenuItem});

    expect(canSeeMenuItem).toEqual(false);
  });

  it('defaults to using accessibleBy if moduleName is missing on subMenuItem', () => {
    const canSeeMenuItem = checkSubMenuAccessibility({authState: authStateWithoutPermissions, subMenuItem: subMenuItemWithoutModuleName});

    expect(canSeeMenuItem).toBe(true);
  });



  describe('when missing params', () => {
    it('handles missing subMenuItem prop', () => {
      const canSeeMenuItem = checkSubMenuAccessibility({authState});

      expect(canSeeMenuItem).toEqual(false);
    });

    it('handles missing authState prop', () => {
      const canSeeMenuItem = checkSubMenuAccessibility({subMenuItem});

      expect(canSeeMenuItem).toEqual(false);
    });
  });
});


describe('SOS feature accessiblity check', () => {

  const authStateWithoutPermissions = {
    user: {
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      name: 'Another somebodyy',
      userType: 'admin',
      expiresAt: null,
      community: {
        name: 'City',
        logoUrl: 'http://image.jpg',
        smsPhoneNumbers: ["+254724821901", "+154724582391"],
        emergencyCallNumber: "254724821901",
      },
      permissions: [          
        {
          module: "note",
          permissions: ['can_create_note', 'can_get_task_count']
         },
        ]
    }
  };


  it('returns true if user has all allowed permissions to access SOS', () => {
    const canAccessSOSFeature = canAccessSOS({authState});

    expect(canAccessSOSFeature).toEqual(true);
  });

  it('returns false if user does not have permissions', () => {
    const canAccessSOSFeature = canAccessSOS({authState: authStateWithoutPermissions});

    expect(canAccessSOSFeature).toEqual(false);
  });

  describe('when missing params', () => {
    it('handles missing authState prop', () => {
      const canAccessSOSFeature = canAccessSOS({});

      expect(canAccessSOSFeature).toEqual(false);
    });
  });
});