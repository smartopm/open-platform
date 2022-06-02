const authState = {
  loaded: true,
  loggedIn: true,
  user: {
    avatarUrl: null,
    community: {
      name: 'City',
      logoUrl: 'http://image.jpg',
      menuItems: [
        {
          menu_link: 'https://some-link',
          menu_name: 'Custom Menu',
          display_on: ['Dashboard'],
          roles: ['admin', 'client']
        }
      ],
      leadMonthlyTargets: [
        { division: 'Africa', target: '15' },
        { division: 'China', target: '15' }
      ],
      smsPhoneNumbers: ['+254724821901', '+154724582391'],
      supportNumber: ['+254724821901', '+154724582391'],
      emergencyCallNumber: '254724821901',
      features: {
        Tasks: { features: [] },
        Messages: { features: [] },
        Payments: { features: [] },
        Properties: { features: [] },
        LogBook: { features: [] }
      },
      imageUrl: 'http://image.jpg',
      timezone: 'Africa/Maputo',
      wpLink: 'http://link.com',
      roles: ['prospective_client']
    },
    email: 'user@community.co',
    expiresAt: null,
    id: '11cdad78',
    imageUrl: 'image.jpg',
    name: 'John Doctor',
    phoneNumber: '260971500000',
    userType: 'admin',
    permissions: [
      {
        module: 'note',
        permissions: [
          'can_see_menu_item',
          'can_get_user_tasks',
          'can_fetch_task_by_id',
          'can_create_note',
          'can_update_note',
          'can_view_create_task_button',
          'can_view_create_sub_task_button',
          'can_delete_note_document',
          'can_mark_task_as_complete',
          'can_access_project_steps',
          'can_create_task_lists'
        ]
      },
      { module: 'gate_access', permissions: ['can_see_menu_item'] },
      { module: 'email_template', permissions: ['can_see_menu_item'] },
      { module: 'land_parcel', permissions: ['can_see_menu_item'] },
      { module: 'plan_payment', permissions: ['can_see_menu_item'] },
      { module: 'timesheet', permissions: ['can_see_menu_item'] },
      { module: 'user', permissions: ['can_see_menu_item', 'can_create_user'] },
      { module: 'label', permissions: ['can_see_menu_item'] },
      { module: 'sos', permissions: ['can_access_sos'] },
      { module: 'discussion', permissions: ['can_see_menu_item'] },
      { module: 'community', permissions: ['can_see_menu_item'] },
      { module: 'community_settings', permissions: ['can_see_menu_item'] },
      {
        module: 'process',
        permissions: ['can_update_process_template', 'can_delete_process_template']
      },
      {
        module: 'business',
        permissions: [
          'can_see_menu_item',
          'can_access_business',
          'can_create_business',
          'can_delete_business',
          'can_update_business'
        ]
      },
      { module: 'campaign', permissions: ['can_see_menu_item'] },
      { module: 'entry_request', permissions: ['can_grant_entry', 'can_update_entry_request'] },
      { module: 'transaction', permissions: ['can_fetch_user_transactions'] },
      {
        module: 'payment_plan',
        permissions: ['can_update_payment_day', 'can_view_menu_list', 'can_create_payment_plan']
      },
      { module: 'plan_payment', permissions: ['can_view_menu_list'] },
      { module: 'dashboard', permissions: ['can_access_dashboard', 'can_see_menu_item'] },
      { module: 'forms', permissions: ['can_view_form_user', 'can_save_draft_form']
      }
    ]
  }
};
export default authState;
