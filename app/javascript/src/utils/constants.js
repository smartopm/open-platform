// values that can be reused across the codebase

export const filterUserByLoggedin = {
  log_from: 'login after',
  log_to: 'login before',
  log_on: 'logged in on'
};

export const wordpressEndpoint =
  'https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com';
export const reasons = ['Visiting', 'Residing', 'Working', 'Passing through', 'Other'];

export const requiredFields = ['userType', 'phoneNumber', 'name', 'email'];

export const userType = {
  admin: 'Admin',
  security_guard: 'Security Guard',
  resident: 'Resident',
  contractor: 'Contractor',
  prospective_client: 'Prospective Client',
  client: 'Client',
  visitor: 'Visitor',
  custodian: 'Store Custodian'
};

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
];

export const userState = {
  valid: 'Valid',
  pending: 'Pending',
  banned: 'Not Allowed',
  expired: 'Expired'
};

export const userSubStatus = {
  plots_fully_purchased: 'Plots Fully Purchased',
  eligible_to_start_construction: 'Eligible to start Construction',
  floor_plan_purchased: 'Floor Plan Purchased',
  construction_approved: 'Construction Approved',
  construction_in_progress: 'Construction in Progress',
  construction_completed: 'Construction Completed',
  census: 'Census',
  workers_on_site: 'Workers on Site',
};

export const subStatus = {
  0: 'Plots Fully Purchased',
  1: 'Eligible to start Construction',
  2: 'Floor Plan Purchased',
  3: 'Construction Approved',
  4: 'Construction in Progress',
  5: 'Construction Completed',
  6: 'Census',
  7: 'Workers on Site',
};

export const paymentPlanStatus = {
  0: 'active',
  1: 'cancelled',
  2: 'deleted'
}

export const paymentStatusColor = {
  pending: '#3493FB',
  settled: '#66A69B',
  denied: '#E79040',
  cancelled: '#E74540',
}

export const paymentStatus = {
  pending: 'Pending',
  settled: 'Settled',
  denied: 'Denied',
  cancelled: 'Cancelled'
}

export const invoiceStatus = {
  inProgress: 'In-Progress',
  paid: 'Paid',
  late: 'Late',
  cancelled: 'Cancelled',
  in_progress: 'In-Progress',
  settled: 'Settled'
};

export const entryReason = [
  'Client',
  'Prospective Client',
  'Working',
  'Sales',
  'Passing through',
  'Other'
];
// This is for the showRoom
export const infoSource = [
  'Family / Friend / Acquaintance',
  'Social Media(Facebook, Twitter or Whatsapp)',
  'Tv/Radio',
  'Other'
];

export const NotesCategories = {
  call: 'Call',
  message: 'Message',
  email: 'Email',
  to_do: 'To-Do',
  form: 'Form'
};

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
};

export const businessStatus = {
  verified: 'Verified',
  pending: 'Pending'
};

export const commentStatusAction = {
  delete: 'deleted',
  validate: 'valid'
};
// Values from here should be managed at the community level
export const ponisoNumber = '+260976064298';

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
];

export const fieldType = {
  text: 0,
  date: 1,
  image: 2,
  signature: 3,
  display_text: 4,
  display_image: 5
};

export const formStatus = {
  rejected: 'Rejected',
  approved: 'Approved',
  pending: 'Pending',
  draft: 'draft',
  publish: 'published',
  delete: 'deleted'
};

export const currencies = {
  zambian_kwacha: 'k'
};

export const mapTiles = {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  mapboxSatellite:
    'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=',
  mapboxStreets:
    'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=',
  openStreetMap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  centerPoint: {
    nkwashi: [-15.5106850854, 28.6493892334]
  }
};

export const publicMapToken = {
  mapbox:
    'pk.eyJ1Ijoiam9obnNvbnNpcnYiLCJhIjoiY2tqOGNzemdzMmg1djJ6bGdubnR4MDY4ciJ9.dUpC4xn0Iwj9MPNrpCx7IQ'
};

export const emptyPolygonFeature = JSON.stringify({
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
      ]

    ]
  },
  properties: {}
});

export const taskStatus = {
  myOpenTasks: 'My Tasks',
  tasksDueIn10Days: 'Tasks due in 10 days',
  tasksDueIn30Days: 'Tasks due in 30 days',
  tasksOpenAndOverdue: 'Overdue Tasks',
  tasksWithNoDueDate: 'Tasks with no due date',
  totalCallsOpen: 'Total Calls Open',
  totalFormsOpen: 'Total Forms Open',
  tasksOpen: 'Tasks Open',
  completedTasks: 'Tasks Completed'
};

export const plotStatusColorPallete = {
    sold: '#DB4949',
    available: '#307404'
}
