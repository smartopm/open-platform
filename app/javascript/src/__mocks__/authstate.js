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
        permissions: [
        'can_see_menu_item',
        'can_create_note',
        'can_get_task_count'
      ]
      },
      gate_access: {
        permissions: ['can_see_menu_item']
      },
      guest_list: {
        permissions:['can_see_menu_item']
      }
   
    }
  }
};
export default authState;
