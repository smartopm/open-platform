// values that can be reused across the codebase

export const filterUserByLoggedin = {
  log_from: 'login after',
  log_to: 'login before',
  log_on: 'Logged in on'
}

export const wordpressEndpoint =
  'https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com'
export const reasons = [
  'Visiting',
  'Residing',
  'Working',
  'Passing through',
  'Other'
]

export const requiredFields = ['userType', 'phoneNumber', 'name', 'email']

export const userType = {
  admin: 'Admin',
  security_guard: 'Security Guard',
  resident: 'Resident',
  contractor: 'Contractor',
  prospective_client: 'Prospective Client',
  client: 'Client',
  visitor: 'Visitor',
  custodian: 'Store Custodian'
}

export const userState = {
  valid: 'Valid',
  pending: 'Pending',
  banned: 'Not Allowed',
  expired: 'Expired'
}

export const entryReason = [
  'Client',
  'Prospective Client',
  'Working',
  'Sales',
  'Passing through',
  'Other'
]
// This is for the showRoom
export const infoSource = [
  'Family / Friend / Acquaintance',
  'Social Media(Facebook, Twitter or Whatsapp)',
  'Tv/Radio',
  'Other'
]

export const areaCode = {
  260: '🇿🇲 +260',
  1: '🇺🇸 +1',
  27: '🇿🇦 +27',
  44: '🇬🇧 +44',
  64: '🇳🇿 +64',
  971: '🇦🇪 +971'
}

export const NotesCategories = {
  call:  'Call',
  message:  'Message',
  email:  'Email',
  to_do:  'To-Do',
}


export const ponisoNumber = '+260976064298'
