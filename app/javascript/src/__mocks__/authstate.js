const authState = {
  loaded: true,
  loggedIn: true,
  user: {
    avatarUrl: null,
    community: {
      name: 'City',
      logoUrl: 'http://image.jpg',
      menuItems: [{ menu_link: 'https://some-link', menu_name: 'Custom Menu' }],
      smsPhoneNumbers: ["+254724821901", "+154724582391"],
      emergencyCallNumber: "254724821901"
    },
    email: 'user@community.co',
    expiresAt: null,
    id: '11cdad78',
    imageUrl: 'image.jpg',
    name: 'John Doctor',
    phoneNumber: '260971500000',
    userType: 'admin'
  }
};
export default authState;
