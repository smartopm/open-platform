/* eslint-disable max-lines */
// values that can be reused across the codebase
import MuiConfig from 'react-awesome-query-builder/lib/config/mui';
import { toTitleCase } from './helpers';

// Prevent Google Analytics reporting from staging and dev domains
export const PRIMARY_DOMAINS = [
  'app.doublegdp.com',
  'tilisi.doublegdp.com',
  'morazancity.doublegdp.com',
  'greenpark.doublegdp.com',
  'enyimba.doublegdp.com',
  'metropolis.doublegdp.com'
];

export const filterUserByLoggedin = {
  log_from: 'login after',
  log_to: 'login before',
  log_on: 'logged in on'
};

// export const wordpressEndpoint =
//   'https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com';
export const reasons = {
  visiting: 'Visiting',
  residing: 'Residing',
  working: 'Working',
  passing_through: 'Passing through',
  other: 'Other'
};

export const defaultBusinessReasons = {
  client: 'Client',
  prospective_client: 'Prospective Client',
  sales: 'Sales',
  working: 'Working',
  passing_through: 'Passing Through',
  other: 'Other'
};

export const LogLabelColors = {
  client: '#254881',
  prospective_client: '#3493FB',
  sales: '#B2D0DC',
  working: '#608DBE',
  passing_through: '#608DBE',
  other: '#608DBE'
};

export const requiredFields = ['userType', 'phoneNumber', 'name'];

export const userType = {
  admin: 'Admin',
  security_guard: 'Security Guard',
  resident: 'Resident',
  contractor: 'Contractor',
  prospective_client: 'Prospective Client',
  client: 'Client',
  visitor: 'Visitor',
  custodian: 'Store Custodian',
  site_worker: 'Site Worker',
  lead: 'Lead',
  marketing_manager: 'Marketing Manager',
  marketing_admin: 'Marketing Admin',
  public_user: 'Public User'
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

export const userStatus = {
  active: 'Active',
  deactivated: 'Deactivated'
};

export const userSubStatus = {
  plots_fully_purchased: 'Plots Fully Purchased',
  eligible_to_start_construction: 'Eligible to start Construction',
  floor_plan_purchased: 'Floor Plan Purchased',
  building_permit_approved: 'Building Permit Approved',
  construction_in_progress: 'Construction in Progress',
  construction_completed: 'Construction Completed',
  construction_in_progress_self_build: 'Construction in Progress (Self Build)'
};

export const subStatus = {
  0: 'Plots Fully Purchased',
  1: 'Eligible to start Construction',
  2: 'Floor Plan Purchased',
  3: 'Building Permit Approved',
  4: 'Construction in Progress',
  5: 'Construction Completed',
  6: 'Construction in Progress (Self Build)'
};

// TODO: Find a way to get these translated
export const customerJourneyStatus = {
  plots_fully_purchased: 'Your plot is currently awaiting eligibility to start construction!',
  eligible_to_start_construction: 'Your plot is currently eligible to purchase floor plan!',
  floor_plan_purchased: 'Your plot is currently awaiting building permit approval!',
  building_permit_approved: 'Your plot is currently awaiting construction!',
  construction_in_progress: 'Your plot is currently awaiting construction completed!',
  construction_in_progress_self_build: 'Your plot is currently awaiting construction completed!',
  construction_completed: 'Your plot is currently completed'
};

export const customerJourneyBar = {
  plots_fully_purchased: 1,
  eligible_to_start_construction: 2,
  floor_plan_purchased: 3,
  building_permit_approved: 4,
  construction_in_progress: 5,
  construction_in_progress_self_build: 5,
  construction_completed: 6
};

export const customerJourneyLink = {
  plots_fully_purchased: '/news/post/864',
  eligible_to_start_construction: '/news/post/864',
  floor_plan_purchased: '/news/post/2198',
  building_permit_approved: '/news/post/2491',
  construction_in_progress: '/news/post/2158',
  construction_in_progress_self_build: '/news/post/2158',
  construction_completed: '/news/post/2158'
};

export const userSubStatusDurationLookup = {
  between0to10Days: 'number of users between 0 - 10 days',
  between11to30Days: 'number of users between 11 - 30 days',
  between31to50Days: 'number of users between 31 - 50 days',
  between51to150Days: 'number of users between 51 - 150 days',
  over151Days: 'number of users over 151 days'
};
export const paymentPlanStatus = {
  0: 'active',
  1: 'cancelled',
  2: 'deleted'
};

export const subscriptionPlanType = {
  0: 'starter',
  1: 'basic',
  2: 'standard',
  3: 'premium'
};

export const paymentPlanFrequency = {
  0: 'daily',
  1: 'weekly',
  2: 'monthly',
  3: 'quarterly'
};

export const paymentType = {
  'cheque/cashier_cheque': 'Cheque/Cashier Cheque',
  mobile_money: 'Mobile Money',
  'bank_transfer/cash_deposit': 'Bank Transfer/Cash Deposit',
  'bank_transfer/eft': 'Bank Transfer/EFT',
  pos: 'Point of Sale',
  cash: 'Cash'
};
export const planType = {
  behind: 'behind',
  on_track: 'on_track',
  upcoming: 'upcoming',
  completed: 'completed',
  cancelled: 'cancelled'
};

export const paymentStatusColor = {
  pending: '#3493FB',
  settled: '#66A69B',
  denied: '#E79040',
  cancelled: '#E74540'
};

export const paymentStatus = {
  settled: 'Settled',
  pending: 'Pending',
  denied: 'Denied',
  cancelled: 'Cancelled'
};

export const invoiceStatus = {
  inProgress: 'In-Progress',
  active: 'Active',
  paid: 'Paid',
  late: 'Late',
  cancelled: 'Cancelled',
  in_progress: 'In-Progress',
  settled: 'Settled',
  pending: 'Pending'
};

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
  form: 'Form',
  emergency: 'Emergency SOS',
  template: 'Process Template',
  task_list: 'Task List'
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
  zambian_kwacha: 'ZMW',
  honduran_lempira: 'HNL',
  kenyan_shilling: 'KES',
  costa_rican_colon: 'CRC',
  nigerian_naira: 'NGN',
  american_dollar: 'USD'
};
export const locales = ['en-IN', 'en-NG', 'en-UK', 'en-US', 'en-ZM', 'es-HN', 'en-KE', 'es-CR'];
export const languages = {
  English: 'en-US',
  Español: 'es-ES'
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
    nkwashi: [-15.5106850854, 28.6493892334],
    'ciudad morazán': [15.620704379778179, -87.92644124884137],
    doublegdp: [-23.1988, 47.6783]
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
  unknown: '#686868',
  planned: '#b3d1ff',
  in_construction: '#ffd11a',
  built: '#00ff00'
};

const InitialConfig = MuiConfig;
export const dateWidget = {
  ...InitialConfig.widgets,
  date: {
    ...InitialConfig.widgets.date,
    dateFormat: 'YYYY.MM.DD',
    valueFormat: 'YYYY-MM-DD'
  },
  datetime: {
    ...InitialConfig.widgets.datetime,
    timeFormat: 'HH:mm',
    dateFormat: 'YYYY.MM.DD',
    valueFormat: 'YYYY-MM-DD HH:mm'
  }
};
export const invoiceQueryBuilderConfig = {
  ...InitialConfig,
  fields: {
    userName: {
      label: 'User Name',
      type: 'text',
      valueSources: ['value']
    },
    invoiceNumber: {
      label: 'Invoice Number',
      type: 'text',
      valueSources: ['value']
    },
    phoneNumber: {
      label: 'Phone Number',
      type: 'number',
      valueSources: ['value']
    },
    email: {
      label: 'Email',
      type: 'text',
      valueSources: ['value']
    },
    plotNumber: {
      label: 'Plot Number',
      type: 'text',
      valueSources: ['value']
    },
    issuedDate: {
      label: 'Issued Date',
      type: 'date',
      valueSources: ['value']
    },
    dueDate: {
      label: 'Due Date',
      type: 'date',
      valueSources: ['value']
    }
  },
  widgets: dateWidget
};

export const invoiceQueryBuilderInitialValue = {
  // Just any random UUID
  id: '76a8a9ba-0123-3344-c56d-b16e532c8cd0',
  type: 'group',
  children1: {
    '98a8a9ba-0123-4456-b89a-b16e721c8cd0': {
      type: 'rule',
      properties: {
        field: 'userName',
        operator: 'equal',
        value: [''],
        valueSrc: ['value'],
        valueType: ['text']
      }
    }
  }
};

export const invoiceFilterFields = {
  userName: 'user',
  invoiceNumber: 'invoice_number',
  phoneNumber: 'phone_number',
  email: 'email',
  plotNumber: 'land_parcel',
  issuedDate: 'created_at',
  dueDate: 'due_date'
};

export const paymentQueryBuilderConfig = {
  ...InitialConfig,
  fields: {
    clientName: {
      label: 'Client Name',
      type: 'text',
      valueSources: ['value']
    },
    paymentType: {
      label: 'Payment Type',
      type: 'select',
      valueSources: ['value'],
      fieldSettings: {
        listValues: Object.entries(paymentType).map(([key, val]) => {
          return { value: key, title: val };
        })
      }
    },
    phoneNumber: {
      label: 'Phone Number',
      type: 'number',
      valueSources: ['value']
    },
    email: {
      label: 'Email',
      type: 'text',
      valueSources: ['value']
    },
    receiptNumber: {
      label: 'Receipt Number',
      type: 'text',
      valueSources: ['value']
    },
    manualReceiptNumber: {
      label: 'Manual Receipt Number',
      type: 'text',
      valueSources: ['value']
    },
    createdDate: {
      label: 'Created Date',
      type: 'date',
      valueSources: ['value']
    },
    amount: {
      label: 'Payment Amount',
      type: 'text',
      valueSources: ['value']
    },
    nrc: {
      label: 'NRC',
      type: 'text',
      valueSources: ['value']
    }
  },
  widgets: dateWidget
};

export const planQueryBuilderConfig = {
  ...InitialConfig,
  fields: {
    status: {
      label: 'Plan Status',
      type: 'select',
      valueSources: ['value'],
      fieldSettings: {
        listValues: Object.entries(planType).map(([key, val]) => {
          return { value: key, title: toTitleCase(val) };
        })
      }
    },
    planType: {
      label: 'Plan Type',
      type: 'select',
      valueSources: ['value'],
      fieldSettings: {
        listValues: Object.entries(subscriptionPlanType).map(([key, val]) => {
          return { value: key, title: toTitleCase(val) };
        })
      }
    },
    amountOwned: {
      label: 'Amount Owed',
      type: 'number',
      valueSources: ['value'],
      excludeOperators: ['not_equal', 'between']
    },
    installmentsDue: {
      label: 'Due Installments',
      type: 'number',
      valueSources: ['value'],
      excludeOperators: ['not_equal', 'between']
    }
  }
};

export const paymentQueryBuilderInitialValue = {
  // Just any random UUID
  id: '76a8a9ba-0123-3344-c56d-b16e532c8cd0',
  type: 'group',
  children1: {
    '98a8a9ba-0123-4456-b89a-b16e721c8cd0': {
      type: 'rule',
      properties: {
        field: 'clientName',
        operator: 'equal',
        value: [''],
        valueSrc: ['value'],
        valueType: ['text']
      }
    }
  }
};

export const planQueryBuilderInitialValue = {
  // Just any random UUID
  id: '76a8a9ba-0123-3344-c56d-b16e532c8cd0',
  type: 'group',
  children1: {
    '98a8a9ba-0123-4456-b89a-b16e721c8cd0': {
      type: 'rule',
      properties: {
        field: 'amountOwned',
        operator: 'equal',
        value: [''],
        valueSrc: ['value'],
        valueType: ['number']
      }
    }
  }
};

export const paymentFilterFields = {
  clientName: 'user',
  phoneNumber: 'phone_number',
  email: 'email',
  createdDate: 'created_at',
  paymentType: 'source',
  receiptNumber: 'automated_receipt_number',
  manualReceiptNumber: 'manual_receipt_number',
  amount: 'amount',
  nrc: 'ext_ref_id'
};

export const entryLogsFilterFields = {
  endTime: 'ends_at',
  visitEndDate: 'visit_end_date'
};

export const entryLogsQueryBuilderConfig = {
  ...InitialConfig,
  fields: {
    endTime: {
      ...InitialConfig.widgets.datetime,
      label: 'Visit End Time',
      timeFormat: 'HH:mm',
      dateFormat: 'YYYY.MM.DD HH:mm',
      valueFormat: 'HH:mm'
    },
    visitEndDate: {
      label: 'Visit End Date',
      type: 'date',
      valueSources: ['value']
    }
  },
  widgets: dateWidget
};

export const entryLogsQueryBuilderInitialValue = {
  // Just any random UUID
  id: '76a8a9ba-0123-3344-c56d-b16e532c8cd0',
  type: 'group',
  children1: {
    '98a8a9ba-0123-4456-b89a-b16e721c8cd0': {
      type: 'rule',
      properties: {
        field: 'endTime',
        operator: 'equal',
        value: [''],
        valueSrc: ['value'],
        valueType: ['datetime']
      }
    }
  }
};
export const planFilterFields = {
  status: 'plan_status',
  amountOwned: 'owing_amount',
  installmentsDue: 'installments_due',
  planType: 'plan_type'
};

export const propertyQueryBuilderConfig = {
  ...InitialConfig,
  fields: {
    owner: {
      label: "Owner's Name",
      type: 'text',
      valueSources: ['value'],
      excludeOperators: ['not_equal']
    },
    ownerAddress: {
      label: "Owner's Address",
      type: 'text',
      valueSources: ['value'],
      excludeOperators: ['not_equal']
    },
    parcelType: {
      label: 'Property Type',
      type: 'text',
      valueSources: ['value']
    },
    plotNumber: {
      label: 'Plot Number',
      type: 'text',
      valueSources: ['value']
    },
    parcelAddress: {
      label: 'Property Address',
      type: 'text',
      valueSources: ['value']
    }
  },
  widgets: dateWidget
};

export const propertyQueryBuilderInitialValue = {
  // Just any random UUID
  id: '76a8a9ba-0123-3344-c56d-b16e532c8cd0',
  type: 'group',
  children1: {
    '98a8a9ba-0123-4456-b89a-b16e721c8cd0': {
      type: 'rule',
      properties: {
        field: 'owner',
        operator: 'equal',
        value: [''],
        valueSrc: ['value'],
        valueType: ['text']
      }
    }
  }
};

export const propertyFilterFields = {
  owner: 'owner',
  ownerAddress: 'owner',
  parcelType: 'parcel_type',
  plotNumber: 'parcel_number',
  parcelAddress: 'address1'
};

export const tasksQueryBuilderConfig = {
  ...InitialConfig,
  fields: {
    assignee: {
      label: 'Assignee',
      type: 'text',
      valueSources: ['value'],
      excludeOperators: ['not_equal']
    },
    userName: {
      label: "User's Name",
      type: 'text',
      valueSources: ['value'],
      excludeOperators: ['not_equal']
    }
  }
};

export const tasksQueryBuilderInitialValue = {
  // Just any random UUID
  id: '76a8a9ba-0123-3344-c56d-b16e532c8cd0',
  type: 'group',
  children1: {
    '98a8a9ba-0123-4456-b89a-b16e721c8cd0': {
      type: 'rule',
      properties: {
        field: 'userName',
        operator: 'equal',
        value: [''],
        valueSrc: ['value'],
        valueType: ['text']
      }
    }
  }
};

export const tasksFilterFields = {
  assignee: 'assignees',
  userName: 'user'
};

export const allUserTypes = [
  'admin',
  'client',
  'security_guard',
  'prospective_client',
  'contractor',
  'resident',
  'visitor',
  'custodian',
  'site_worker',
  'site_manager',
  'security_supervisor',
  'consultant',
  'developer',
  'marketing_manager',
  'marketing_admin',
  'lead'
];

export const siteManagers = [
  'admin',
  'security_guard',
  'contractor',
  'custodian',
  'site_worker',
  'developer'
];

export const gateAccessUsers = ['admin', 'security_guard', 'client', 'custodian', 'resident'];

export const guestListUsers = ['admin', 'client', 'custodian', 'resident'];
export const pointOfInterestIconSet = {
  completedHome: {
    label: 'Completed Home',
    icon: 'completedHome'
  },
  homeInConstruction: {
    label: 'Home In Construction',
    icon: 'homeInConstruction'
  },
  sculpture: {
    label: 'Sculpture',
    icon:
      'https://cdn4.iconfinder.com/data/icons/logistics-and-transport-1/24/icn-place-stop-512.png'
  }
};

export const communityVisitingHours = {
  nkwashi: {
    weekday: { min: 8, max: 16 },
    saturday: { min: 8, max: 12 },
    sunday: { isNotOff: false }
  },
  'ciudad morazán': {
    weekday: { min: 0, max: 24 },
    saturday: { min: 0, max: 24 },
    sunday: { isNotOff: true }
  },
  doublegdp: {
    weekday: { min: 8, max: 16 },
    saturday: { min: 8, max: 12 },
    sunday: { isNotOff: false }
  }
};

export const PropertyStatus = {
  land: 'active',
  house: ['planned', 'in_construction', 'built']
};

export const sosAllowedUsers = ['admin', 'guard', 'resident', 'custodian'];

// Single place to manage list of specific community features to exclude
export const CommunityFeaturesWhiteList = {
  denyGateAccessButton: 'Deny Gate Access Button',
  automatedTaskReminders: 'Automated Task Reminders',
  guestVerification: 'Guest Verification'
};

export const clientCategories = [
  'Company',
  'Intermediary',
  'Multilateral Organization',
  'Industry Association',
  'Public sector'
];

export const internationalizationLevels = [
  'Exporting outside of Africa',
  'Exporting to Nigeria',
  'Exporting to West Africa',
  'Exporting to Africa',
  'Operating internationally outside of Africa',
  'Operating in Nigeria',
  'Operating in West Africa',
  'Operating in Africa'
];

export const leadTemperatureOptions = ['Cold', 'Neutral', 'Warm', 'Hot'];

export const leadStatusOptions = [
  'Qualified Lead',
  'Interest Shown',
  'Investment Motive Verified',
  'Signed MOU',
  'Signed Lease',
  'Evaluation',
  'Stakeholder Meetings',
  'Site Visit'
];

export const leadSourceOptions = [
  'Company database',
  'Digital marketing',
  'Inbound inquiry',
  'Cold calling',
  'Network',
  'Referral',
  'Events'
];

export const leadTypeOptions = ['Company', 'Investment fund'];

export const industryCategoryOptions = [
  'Software & IT services',
  'Business Services',
  'Financial Services',
  'Industrial Machinery, Equipment & Tools',
  'Communications',
  'Transportation',
  'Automotive Components',
  'Real Estate',
  'Chemicals',
  'Food & Tobacco',
  'Coal, Oil and Natural Gas',
  'Metals',
  'Electronic Components',
  'Plastics',
  'Consumer Products',
  'Consumer Products',
  'Hotels & Tourism',
  'Alternative/Renewable energy',
  'Automotive OEM',
  'Pharmaceuticals',
  'Textiles',
  'Medical Devices',
  'Healthcare',
  'Business Machines & Equipment',
  'Consumer Electronics',
  'Aerospace',
  'Semiconductors',
  'Paper, Printing & Packaging',
  'Building & Construction Materials',
  'Rubber',
  'Warehousing & Storage',
  'Beverages',
  'Non-Automotive Transport OEM',
  'Biotechnology',
  'Ceramics & Glass',
  'Engines & Turbines',
  'Wood Products',
  'Leisure & Entertainment',
  'Space & Defence',
  'Minerals'
];

export const industryBusinessActivityOptions = [
  'Sales, Marketing & Support',
  'Manufacturing',
  'Business Services',
  'Logistics, Distribution & Transportation',
  'Design, Development & Testing',
  'Headquarters',
  'Construction',
  'ICT & Internet Infrastructure',
  'Customer Contact Centre',
  'Electricity',
  'Research & Development',
  'Maintenance & Servicing',
  'Extraction',
  'Education & Training',
  'Shared Services Centre',
  'Technical Support Centre',
  'Recycling'
];

export const industrySubSectorOptions = [
  'Software publishers, except video games',
  'Retail banking',
  'Freight/Distribution Services',
  'Corporate & investment banking',
  'Custom computer programming services',
  'Internet publishing & broadcasting & web search',
  'Advertising, PR, & related',
  'Legal services',
  'All other electrical equipment & components',
  'General purpose machinery',
  'Professional, scientific & technical services',
  'Insurance',
  'Accommodation',
  'Pharmaceutical preparations',
  'Basic chemicals',
  'Paints, coatings, additives & adhesives',
  'Communications equipment',
  'Employment services',
  'Automobiles',
  'Investment management',
  'Business support services',
  'Data processing, hosting, & related services',
  'Wireless telecommunication carriers',
  'Other motor vehicle parts',
  'Real estate services',
  'Commercial & institutional building construction',
  'Computer & peripheral equipment',
  'Wired telecommunication carriers',
  'Semiconductors & other electronic components',
  'Medical equipment & supplies',
  'Architectural, engineering, & related services',
  'Agriculture, construction, & mining machinery',
  'Steel products',
  'Management consulting services',
  'Air transportation',
  'Other support services',
  'Solar electric power',
  'Motor vehicle gasoline engines & engine parts',
  'Clothing & clothing accessories',
  'Measuring & control instruments',

  'Plastics packaging materials & unlaminated film & sheets',
  'Audio & video equipment',
  'Warehousing & storage',

  'Cosmetics, perfume, personal care & household products',
  'Oil & gas extraction',
  'Other fabricated metal products',
  'Converted paper products',
  'Cement & concrete products',

  'Aircraft engines, other parts & auxiliary equipment',
  'Laminated plastics plates, sheets & shapes',
  'Wind electric power',
  'Rental & leasing services',
  'Residential building construction',

  'Offices of physicians, dentists, & other healthcare practitioners',
  'Travel arrangement & reservation services',
  'Biological products (except diagnostic)',
  'Motor vehicle electrical & electronic equipment',
  'Power transmission equipment',
  'Aircraft',
  'Urethane, foam products & other compounds',
  'Other petroleum & coal products',

  'Ventilation, heating, air conditioning, and commercial refrigeration equipment manufacturing',
  'Tyres',
  'Water transportation',
  'Heavy duty trucks',
  'Biomass power',
  'Household appliances',
  'Fruits & vegetables & specialist foods ',
  'Alumina & aluminium production and processing',
  'Engines & Turbines',
  'Furniture, homeware & related products (Consumer Products)',
  'Video games, applications and digital content',

  'Accounting, tax preparation, bookkeeping, & payroll services',
  'Industrial building construction',
  'Metalworking machinery',
  'Computer systems design services',
  'Motor vehicle seating & interior trim',
  'Heavy & civil engineering',
  'Dairy products',
  'All other industrial machinery',
  'Soft drinks & ice',

  'Schools, colleges, universities, & professional schools',
  'Grains & oilseed',
  'Motor vehicle steering & suspension components',
  'Sugar & confectionary products',
  'Radio & TV broadcasting',
  'Gold ore & silver ore mining',
  'Glass & glass products',
  'Pesticide, fertilisers & other agricultural chemicals',
  'Outpatient care centres & medical & diagnostic laboratories',
  'Breweries & distilleries',
  'Motor vehicle body & trailers',
  'Wood products',
  'Nonstore retailers',
  'Motion picture & sound recording industries',
  'Ships & boats',
  'Textiles & Textile Mills',
  'Electric lighting equipment',
  'Food & Beverage Stores (Food & Tobacco)',
  'Natural, liquefied and compressed gas'
];

export const regionOptions = [
  'Asia (Ex. Near East)',
  'Baltics',
  'C.W. Of Ind. States',
  'Eastern Europe',
  'Latin Amer. & Carib',
  'Near East',
  'Northern Africa',
  'Northern America',
  'Oceania',
  'Sub-Saharan Africa',
  'Western Europe Asia (Ex. Near East)'
];

export const countries = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'American Samoa',
  'Andorra',
  'Angola',
  'Anguilla',
  'Antigua & Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas, The',
  'Bahrain',
  'Bahrain',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bosnia & Herzegovina',
  'Botswana',
  'Brazil',
  'British Virgin Is.',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burma',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Cayman Islands',
  'Central African Rep.',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo, Dem. Rep.',
  'Congo, Repub. of the',
  'Cook Islands',
  'Costa Rica',
  "Cote d'Ivoire",
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'East Timor',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Faroe Islands',
  'Fiji',
  'Finland',
  'France',
  'French Guiana',
  'French Polynesia',
  'Gabon',
  'Gambia',
  'Gaza Strip',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'Greece',
  'Greenland',
  'Grenada',
  'Guadeloupe',
  'Guam',
  'Guatemala',
  'Guernsey',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Isle of Man',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jersey',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea, North',
  'Korea, South',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macau',
  'Macedonia',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Martinique',
  'Mauritania',
  'Mauritius',
  'Mayotte',
  'Mexico',
  'Micronesia, Fed. St.',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'Netherlands Antilles',
  'New Caledonia',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'N. Mariana Islands',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Reunion',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Helena',
  'Saint Kitts & Nevis',
  'Saint Lucia',
  'St Pierre & Miquelon',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome & Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Togo',
  'Tonga',
  'Trinidad & Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Turks & Caicos Is',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Vietnam',
  'Virgin Islands',
  'Wallis and Futuna',
  'West Bank',
  'Western Sahara',
  'Yemen',
  'Zambia',
  'Zimbabwe'
];

export const divisionOptions = ['China', 'Europe', 'India'];

export const months = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: '11',
  12: '12'
};

export const leadStatuses = {
  Ql: 'Qualified Lead',
  Is: 'Interest Shown',
  Iv: 'Interest Shown',
  Sm: 'Signed MOU',
  Sl: 'Signed Lease',
  Ev: 'Evaluation',
  St: 'Stakeholder Meetings',
  Sv: 'Site Visit',
  Im: 'Investment Motive Verified'
};

export const statuses = {
  Ql: 'Qualified Lead',
  Sl: 'Signed Lease',
  Sm: 'Signed MOU'
};

export const scoreCardTitle = {
  qualified_lead: 'Qualified Leads',
  signed_lease: 'Signed Leases',
  signed_mou: 'Signed MOUs'
};

export const years = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '11': 'Apr',
  '12': 'May',
  '13': 'Jun',
  '21': 'Jul',
  '22': 'Aug',
  '23': 'Sep',
  '31': 'Oct',
  '32': 'Nov',
  '33': 'Dec'
};

export const accessibilityOptions = {
  admins: 'Admins Only',
  everyone: 'Everyone'
}

export const initialData = {
  title: '',
  description: '',
  eventType: '',
  eventCondition: '',
  eventConditionQuery: '',
  actionType: ''
};