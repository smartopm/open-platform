// values that can be reused across the codebase

export const filterUserByLoggedin = {
  log_from: 'login after',
  log_to: 'login before',
  log_on: 'logged in on'
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

export const colorPallete = [
   '#2c8bd0',
   '#f07030',
   '#61d190',
   '#b54ecf',
   '#65d11e',
   '#afcf21',
   '#cf9e28',
   '#cfc028',
   '#cf5628',
   '#3a7047'
]

export const userState = {
  valid: 'Valid',
  pending: 'Pending',
  banned: 'Not Allowed',
  expired: 'Expired'
}

export const userSubStatus = {
  applied: 'Applied',
  architecture_reviewed: 'Architecture Reviewed',
  approved: 'Approved',
  contracted: 'Contracted',
  built: 'Built',
  in_construction: 'In Construction',
  interested: 'Interested',
  moved_in: 'Moved-In',
  paying: 'Paying',
  ready_for_construction: 'Ready for Construction',
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

export const NotesCategories = {
  call: 'Call',
  message: 'Message',
  email: 'Email',
  to_do: 'To-Do',
  form: 'Form'
}

export const businessCategories = {
  agriculture: 'Agriculture and Farming',
  real_estate: 'Real Estate',
  art: 'Arts and Culture',
  transportation: 'Transportation',
  construction: 'Construction',
  health: 'Health Service',
  restaurant: 'Restaurant',
  beauty_salon: 'Beauty Salon',
  supermarket: 'Supermarket'
}

export const businessStatus = {
  verified: 'Verified',
  pending: 'Pending'
}

export const commentStatusAction = {
  delete: 'deleted',
  validate: 'valid'
}
// Values from here should be managed at the community level
export const ponisoNumber = '+260976064298'
export const salesSupport = [
  {
    contact: '+260 966 194383',
    type: 'phone'
  },
  {
    contact: '+260 760 635024',
    type: 'phone'
  },
  {
    contact: ' nkwashi-sales@doublegdp.com',
    type: 'mail'
  }
]

export const customerCare = [
  {
    contact: '+260 976 261199',
    type: 'phone'
  },
  {
    contact: '+260 974 624243',
    type: 'phone'
  },
  {
    contact: '+260 974 624243',
    type: 'whatsapp'
  },
  {
    contact: 'support@doublegdp.com',
    type: 'mail'
  }
]

export const messageFilters = [
  {
    value: 'sms/',
    title: 'SMS'
  },
  {
    value: 'email/',
    title: 'Email'
  },
  {
    value: '/campaign',
    title: 'Campaign'
  },
  {
    value: '/non_campaign',
    title: 'Non Campaign'
  },
  {
    value: 'sms/campaign',
    title: 'SMS and Campaign'
  },
  {
    value: 'sms/non_campaign',
    title: 'SMS and Non-Campaign'
  },
  {
    value: 'email/campaign',
    title: 'Email and Campaign'
  },
  {
    value: 'email/non_campaign',
    title: 'Email and Non-Campaign'
  }
]

export const fieldType = {
  text: 0,
  date: 1,
  image: 2,
  signature: 3,
  display_text: 4,
  display_image: 5
}
