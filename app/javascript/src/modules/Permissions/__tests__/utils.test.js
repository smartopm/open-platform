import permissionsCheck, { modulePermissionCheck } from '../utils';

describe('Permissions check', () => {
  const permissions = [
    'can_fetch_task_by_id',
    'can_fetch_task_comments',
    'can_fetch_task_histories',
    'can_get_task_count',
    'can_get_task_stats',
    'can_get_user_tasks',
  ];

  const allowedPermissions = [
    'can_get_user_tasks',
    'can_fetch_task_by_id'
  ];

  const userPermissions = [
    {
      module: 'amenity',
      permissions: ['can_access_amenities', 'can_edit_amenities', 'can_delete_amenities', 'can_create_amenity'],
    },
    {
      module: 'my_forms',
      permissions: ['can_access_own_forms'],
    },
  ]
  it('returns true if user has all allowed permissions', () => {
    const hasPermissions = permissionsCheck(permissions, allowedPermissions);

    expect(hasPermissions).toEqual(true);
  });

  it('returns false if user does not have permissions', () => {
    const hasPermissions = permissionsCheck(['dummy_permissions'], allowedPermissions);

    expect(hasPermissions).toEqual(false);
  });

  it('returns false if user does not have allowed permissions', () => {
    const hasPermissions = permissionsCheck(permissions, ['not_allowed', 'cant_see']);

    expect(hasPermissions).toEqual(false);
  });

  it('returns false if user is missing an allowed permission', () => {
    const hasPermissions = permissionsCheck(permissions, ['can_fetch_task_by_id', 'not_allowed']);

    expect(hasPermissions).toEqual(false);
  });

  it('checks for permissions using for a specific module', () => {
    const hasAccess = modulePermissionCheck(userPermissions, 'amenity', allowedPermissions)
    expect(hasAccess).toEqual(false);

    const amenityPermissions = ['can_access_amenities', 'can_edit_amenities']
    const hasAmenityAccess = modulePermissionCheck(userPermissions, 'amenity', amenityPermissions)
    expect(hasAmenityAccess).toEqual(true);
  })

  describe('when missing params', () => {
    it('handles missing permissions prop', () => {
      const hasPermissions = permissionsCheck(allowedPermissions);

      expect(hasPermissions).toEqual(false);
    });

    it('handles missing allowedPermissions prop', () => {
      const hasPermissions = permissionsCheck(permissions);

      expect(hasPermissions).toEqual(false);
    });

    it('handles missing either params', () => {
      const hasPermissions = modulePermissionCheck(permissions);
      expect(hasPermissions).toEqual(false);
    });
  });
});
