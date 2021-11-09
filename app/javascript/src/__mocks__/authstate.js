const authState = {
  loaded: true,
  loggedIn: true,
  user: {
    avatarUrl: null,
    community: {
      name: 'City',
      logoUrl: 'http://image.jpg',
      menuItems: [{ menu_link: 'https://some-link', menu_name: 'Custom Menu', display_on: ['Dashboard'], roles: ['admin', 'client'] }],
      smsPhoneNumbers: ["+254724821901", "+154724582391"],
      emergencyCallNumber: "254724821901",
      features: {}
    },
    email: 'user@community.co',
    expiresAt: null,
    id: '11cdad78',
    imageUrl: 'image.jpg',
    name: 'John Doctor',
    phoneNumber: '260971500000',
    userType: 'admin',
    permissions: {
      note: {
        permissions: ['can_see_menu_item', 'can_get_user_tasks', 'can_fetch_task_by_id']
      },
      gate_access: {
        permissions: ['can_see_menu_item']
      },
      email_template: {
        permissions: ['can_see_menu_item']
      },
      land_parcel: {
        permissions: ['can_see_menu_item']
      },
      plan_payment: {
        permissions: ['can_see_menu_item']
      },
      timesheet: {
        permissions: ['can_see_menu_item']
      },
      user: {
          permissions: ['can_see_menu_item']
      },
      label: {
        permissions: ['can_see_menu_item']
      },
      sos: {
        permissions: ['can_access_sos']
      },
      discussion: {
        permissions: ['can_see_menu_item']
      },
      community: {
        permissions: ['can_see_menu_item']
      },
      community_settings: {
        permissions: ['can_see_menu_item']
      },
      business: {
        permissions: [
          'can_see_menu_item',
          'can_access_business',
          'can_create_business',
          'can_delete_business'
        ]
      },
      campaign: {
        permissions: ['can_see_menu_item']
      },
      entry_request: {
        permissions: ['can_grant_entry', 'can_update_entry_request']
      },
    }
  }
};
export default authState;
