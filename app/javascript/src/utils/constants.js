// values that can be reused across the codebase

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
  64: 'Nz +64',
  971: 'AE +971'
}
export const ponisoNumber = '+260976064298'
