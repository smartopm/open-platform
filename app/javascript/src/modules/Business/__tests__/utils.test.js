import {canCreateBusiness, canDeleteBusiness } from '../utils'
import authState from '../../../__mocks__/authstate';

describe('Create Business UI accessiblity check', () => {

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
      permissions: {
        note: {
          permissions: [
          'can_create_note',
          'can_get_task_count'
        ]
        }
      }
    }
  };


  it('returns true if user has all allowed permissions to create business', () => {
    const createBusiness = canCreateBusiness({authState});

    expect(createBusiness).toEqual(true);
  });

  it('returns false if user does not have permissions', () => {
    const createBusiness = canCreateBusiness({authState: authStateWithoutPermissions});

    expect(createBusiness).toEqual(false);
  });

  describe('when missing params', () => {
    it('handles missing authState prop', () => {
      const createBusiness = canCreateBusiness({});

      expect(createBusiness).toEqual(false);
    });
  });
});


describe('Delete Business UI accessiblity check', () => {

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
        permissions: {
          note: {
            permissions: [
            'can_create_note',
            'can_get_task_count'
          ]
          }
        }
      }
    };
  
  
    it('returns true if user has all allowed permissions to delete business', () => {
      const deleteBusiness = canDeleteBusiness({authState});
  
      expect(deleteBusiness).toEqual(true);
    });
  
    it('returns false if user does not have permissions', () => {
      const deleteBusiness = canDeleteBusiness({authState: authStateWithoutPermissions});
  
      expect(deleteBusiness).toEqual(false);
    });
  
    describe('when missing params', () => {
      it('handles missing authState prop', () => {
        const deleteBusiness = canDeleteBusiness({});
  
        expect(deleteBusiness).toEqual(false);
      });
    });
  });