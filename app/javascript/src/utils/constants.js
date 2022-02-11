/* eslint-disable max-lines */
// values that can be reused across the codebase
import MaterialConfig from 'react-awesome-query-builder/lib/config/material'
import { toTitleCase } from './helpers';
import { industryCategory } from './constants';


// Prevent Google Analytics reporting from staging and dev domains
export const PRIMARY_DOMAINS = [
    'app.doublegdp.com',
    'tilisi.doublegdp.com',
    'morazancity.doublegdp.com',
    'greenpark.doublegdp.com',
    'enyimba.doublegdp.com',
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
}

export const defaultBusinessReasons = {
  client: 'Client',
  prospective_client: 'Prospective Client',
  sales: 'Sales',
  working: 'Working',
  passing_through: 'Passing Through',
  other: 'Other',
};

export const LogLabelColors = {
  client: '#254881',
  prospective_client: '#3493FB',
  sales: '#B2D0DC',
  working: '#608DBE',
  passing_through: '#608DBE',
  other: '#608DBE',
}

export const requiredFields = ['userType', 'phoneNumber', 'name', 'email'];

export const userType = {
  admin: 'Admin',
  security_guard: 'Security Guard',
  resident: 'Resident',
  contractor: 'Contractor',
  prospective_client: 'Prospective Client',
  client: 'Client',
  visitor: 'Visitor',
  custodian: 'Store Custodian',
  site_worker: 'Site Worker'
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
  construction_completed: 'Your plot is currently completed',
};

export const customerJourneyBar = {
  plots_fully_purchased: 1,
  eligible_to_start_construction: 2,
  floor_plan_purchased: 3,
  building_permit_approved: 4,
  construction_in_progress: 5,
  construction_in_progress_self_build: 5,
  construction_completed: 6,
};

export const customerJourneyLink = {
  plots_fully_purchased: '/news/post/864',
  eligible_to_start_construction: '/news/post/864',
  floor_plan_purchased: '/news/post/2198',
  building_permit_approved: '/news/post/2491',
  construction_in_progress: '/news/post/2158',
  construction_in_progress_self_build: '/news/post/2158',
  construction_completed: '/news/post/2158',
};

export const userSubStatusDurationLookup = {
  between0to10Days: 'number of users between 0 - 10 days',
  between11to30Days: 'number of users between 11 - 30 days',
  between31to50Days: 'number of users between 31 - 50 days',
  between51to150Days: 'number of users between 51 - 150 days',
  over151Days: 'number of users over 151 days',
};
export const paymentPlanStatus = {
  0: 'active',
  1: 'cancelled',
  2: 'deleted'
}

export const subscriptionPlanType = {
  0: 'starter',
  1: 'basic',
  2: 'standard',
  3: 'premium'
}

export const paymentPlanFrequency = {
  0: 'daily',
  1: 'weekly',
  2: 'monthly',
  3: 'quarterly'
}

export const paymentType = {
  'cheque/cashier_cheque': 'Cheque/Cashier Cheque',
  mobile_money: 'Mobile Money',
  'bank_transfer/cash_deposit': 'Bank Transfer/Cash Deposit',
  'bank_transfer/eft': 'Bank Transfer/EFT',
  pos: 'Point of Sale',
  cash: 'Cash'
};
export const planType = {
  'behind': 'behind',
  'on_track': 'on_track',
  'upcoming': 'upcoming',
  'completed': 'completed',
  'cancelled': 'cancelled'
};

export const paymentStatusColor = {
  pending: '#3493FB',
  settled: '#66A69B',
  denied: '#E79040',
  cancelled: '#E74540',
}

export const paymentStatus = {
  settled: 'Settled',
  pending: 'Pending',
  denied: 'Denied',
  cancelled: 'Cancelled'
}

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
  template: 'DRC Process Template'
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
  costa_rican_colon: 'CRC'
};
export const locales = [
  'en-IN',
  'en-NG',
  'en-UK',
  'en-US',
  'en-ZM',
  'es-HN',
  'en-KE',
  'es-CR'
]
export const languages = {
  'English': 'en-US',
  'Español': 'es-ES',
}
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
    doublegdp: [-23.1988, 47.6783],
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
    built: '#00ff00',
}

const InitialConfig = MaterialConfig
export const dateWidget = {
  ...InitialConfig.widgets,
  date: {
    ...InitialConfig.widgets.date,
    dateFormat: "YYYY.MM.DD",
    valueFormat: "YYYY-MM-DD",
  },
  datetime: {
    ...InitialConfig.widgets.datetime,
    timeFormat: "HH:mm",
    dateFormat: "YYYY.MM.DD",
    valueFormat: "YYYY-MM-DD HH:mm",
  }
}
  export const invoiceQueryBuilderConfig = {
    ...InitialConfig,
    fields: {
      userName: {
        label: 'User Name',
        type: 'text',
        valueSources: ['value'],
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
        valueSources: ['value'],
      },
      dueDate: {
        label: 'Due Date',
        type: 'date',
        valueSources: ['value'],
      }
    },
    widgets: dateWidget
  }

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
  }

  export const invoiceFilterFields = {
    userName: 'user',
    invoiceNumber: 'invoice_number',
    phoneNumber: 'phone_number',
    email: 'email',
    plotNumber: 'land_parcel',
    issuedDate: 'created_at',
    dueDate: 'due_date'
  }

  export const paymentQueryBuilderConfig = {
    ...InitialConfig,
    fields: {
      clientName: {
        label: 'Client Name',
        type: 'text',
        valueSources: ['value'],
      },
      paymentType: {
        label: 'Payment Type',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: Object.entries(paymentType).map(([key, val]) => {
            return { value: key, title: val }
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
  }

  export const planQueryBuilderConfig = {
    ...InitialConfig,
    fields: {
      status: {
        label: 'Plan Status',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: Object.entries(planType).map(([key, val]) => {
            return { value: key, title: toTitleCase(val) }
          })
        }
      },
      planType: {
        label: 'Plan Type',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
        listValues: Object.entries(subscriptionPlanType).map(([key, val]) => {
            return { value: key, title: toTitleCase(val) }
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
  }

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
  }

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
      },
    }
  }
}

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
  }

export const entryLogsFilterFields = {
  endTime: 'ends_at',
  visitEndDate: 'visit_end_date'
}

export const entryLogsQueryBuilderConfig = {
  ...InitialConfig,
  fields: {
    endTime: {
      ...InitialConfig.widgets.datetime,
      label: 'Visit End Time',
      timeFormat: "HH:mm",
      dateFormat: "YYYY.MM.DD HH:mm",
      valueFormat: "HH:mm",
    },
    visitEndDate: {
      label: 'Visit End Date',
      type: 'date',
      valueSources: ['value'],
    },
  },
  widgets: dateWidget
}

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
}
  export const planFilterFields = {
    status: 'plan_status',
    amountOwned: 'owing_amount',
    installmentsDue: 'installments_due',
    planType: 'plan_type'
  }

  export const propertyQueryBuilderConfig = {
    ...InitialConfig,
    fields: {
      owner: {
        label: 'Owner\'s Name',
        type: 'text',
        valueSources: ['value'],
        excludeOperators: ['not_equal']
      },
      ownerAddress: {
        label: 'Owner\'s Address',
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
      },
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
    parcelAddress: 'address1',
  };

  export const tasksQueryBuilderConfig = {
    ...InitialConfig,
    fields: {
      assignee: {
        label: 'Assignee',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: {
            value: "User's name",
            title: "User's name"
          }
        }
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
          field: 'assignee',
          operator: 'select_equals',
          value: [''],
          valueSrc: ['value'],
          valueType: ['select']
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
    'developer'
  ];

  export const siteManagers = [
    'admin',
    'security_guard',
    'contractor',
    'custodian',
    'site_worker',
    'developer'
  ]

  export const gateAccessUsers = [
    'admin',
    'security_guard',
    'client',
    'custodian',
    'resident'
  ]

  export const guestListUsers = [
    'admin',
    'client',
    'custodian',
    'resident'
  ]
  export const pointOfInterestIconSet = {
    completedHome: {
      label: 'Completed Home',
      icon: 'completedHome',
    },
    homeInConstruction: {
      label: 'Home In Construction',
      icon: 'homeInConstruction',
    },
    sculpture: {
      label: 'Sculpture',
      icon: 'https://cdn4.iconfinder.com/data/icons/logistics-and-transport-1/24/icn-place-stop-512.png',
    },
  };

  export const communityVisitingHours = {
    nkwashi: {
      weekday: { min: 8, max: 16 },
      saturday: { min: 8, max: 12 },
      sunday: { isNotOff: false },
    },
    'ciudad morazán': {
      weekday: { min: 0, max: 24 },
      saturday: { min: 0, max: 24 },
      sunday: { isNotOff: true },
    },
    doublegdp: {
      weekday: { min: 8, max: 16 },
      saturday: { min: 8, max: 12 },
      sunday: { isNotOff: false },
    },
  };

  export const PropertyStatus = {
    land: 'active',
    house: [ 'planned', 'in_construction', 'built'],
  }

  export const sosAllowedUsers = [
    'admin',
    'guard',
    'resident',
    'custodian'
  ];

  // Single place to manage list of specific community features to exclude
  export const CommunityFeaturesWhiteList = {
    denyGateAccessButton: 'Deny Gate Access Button',
    automatedTaskReminders: 'Automated Task Reminders',
    guestVerification: "Guest Verification"
  }


  export const clientCategories = {
    company: 'Company',
    intermediary: 'Intermediary',
    multilateralOrganization: 'Multilateral Organization',
    industryAssociation: 'Industry Association',
    publicSector: 'Public sector',
  };

  export const internationalizationLevels = {
    exportingOutsideOfAfrica: 'Exporting outside of Africa',
    exportingToNigeria: 'Exporting to Nigeria',
    exportingToWestAfrica: 'Exporting to West Africa',
    exportingToAfrica: 'Exporting to Africa',
    operatingInternationallyOutsideOfAfrica: 'Operating internationally outside of Africa',
    operatingInNigeria: 'Operating in Nigeria',
    operatingInWestAfrica: 'Operating in West Africa',
    operatingInAfrica: 'Operating in Africa'
  };

  export const leadTemperatureOptions = {
    cold: 'Cold',
    neutral: 'Neutral',
    warm: 'Warm',
    hot: 'Hot',
  };

  export const leadStatusOptions = {
    interestShown: 'Interest shown',
    investimentMotiveVerified: 'Investment motive verified',
    evaluation: 'Evaluation',
    stakeholderMeetings: 'Stakeholder meetings',
    siteVisit: 'Site Visit',
    readyToSign: 'Ready to sign',
  };

  export const leadSourceOptions = {
    companyDatabase:  "Company database",
    digitalMarketing: "Digital marketing",
    inboundInquiry: "Inbound inquiry",
    coldCalling: "Cold calling",
    network: "Network",
    referral: "Referral",
    events: "Events"
  }

  export const leadTypeOptions = {
    company: "Company",
    investmentFund: "Investment fund"
  }

  export const industryCategoryOptions = {
    softwareServices:  "Software & IT services",
    businessServices: "Business Services",
    financialServices: "Financial Services",
    industrialMachinery: "Industrial Machinery, Equipment & Tools",
    communications: "Communications",
    transportation: "Transportation",
    automotiveComponents: "Automotive Components",
    realEstate: "Real Estate",
    chemicals: "Chemicals",
    foodAndTobacco: "Food & Tobacco",
    metals: "Metals",
    electronicComponents: "Electronic Components",
    plastics: "Plastics",
    consumerProducts: "Consumer Products",
    hotelsAndTourism: "Hotels & Tourism",
    alternativeOrRenewableEnergy: "Alternative/Renewable energy",
    automotiveOEM: "Automotive OEM",
    pharmaceuticals: "Pharmaceuticals",
    textiles: "Textiles",
    medicalDevices: "Medical Devices",
    healthcare: "Healthcare",
    businessMachinesAndEquipment: "Business Machines & Equipment",
    consumerElectronics: "Consumer Electronics",
    aerospace: "Aerospace",
    semiconductors: "Semiconductors",
    paperAndprintingAndPackaging: "Paper, Printing & Packaging",
    buildingAndConstructionMaterials: "Building & Construction Materials",
    rubber: "Rubber",
    warehousingAndStorage: "Warehousing & Storage",
    beverages: "Beverages",
    nonAutomotiveTransportOEM: "Non-Automotive Transport OEM",
    biotechnology: "Biotechnology",
    ceramicsAndGlass: "Ceramics & Glass",
    enginesAndTurbines: "Engines & Turbines",
    woodProducts: "Wood Products",
    leisureAndEntertainment: "Leisure & Entertainment",
    spaceDefence: "Space & Defence",
    minerals: "Minerals"
  }

  export const industryBusinessActivityOptions = {
    salesMarketingAndSupport:  "Sales, Marketing & Support",
    manufacturing: "Manufacturing",
    businessServices: "Business Services",
    logisticsDistributionAndTransportation: "Logistics, Distribution & Transportation",
    designDevelopmentAndTesting: "Design, Development & Testing",
    headquarters: "Headquarters",
    construction: "Construction",
    internetInfrastructure: "ICT & Internet Infrastructure",
    customerContactCentre: "Customer Contact Centre",
    electricity: "Electricity",
    researchDevelopment: "Research & Development",
    maintenanceServicing: "Maintenance & Servicing",
    extraction: "Extraction",
    educationTraining: "Education & Training",
    sharedServicesCentre: "Shared Services Centre",
    technicalSupportCentre: "Technical Support Centre",
    recycling: "Recycling"
  }

  export const industrySubSectorOptions = {
    softwarePublishersExceptVideoGames: "Software publishers, except video games",
    retailBanking: "Retail banking",
    freightDistributionServices: "Freight/Distribution Services",
    corporateInvestmentBanking: "Corporate & investment banking",
    customComputerProgrammingServices: "Custom computer programming services",
    internetPublishingBroadcastingWebSearch: "Internet publishing & broadcasting & web search",
    advertisingPrRelated: "Advertising, PR, & related",
    legalServices: "Legal services",
    allOtherElectricalEquipmentComponents: "All other electrical equipment & components",
    generalPurposeMachinery: "General purpose machinery",
    professionalScientificTechnicalServices: "Professional, scientific & technical services",
    insurance: "Insurance",
    accommodation: "Accommodation",
    pharmaceuticalPreparations: "Pharmaceutical preparations",
    basicChemicals: "Basic chemicals",
    paintsCoatingsAdditivesAdhesives: "Paints, coatings, additives & adhesives",
    communicationsEquipment: "Communications equipment",
    employmentServices: "Employment services",
    automobiles: "Automobiles",
    investmentManagement: "Investment management",
    businessSupportServices: "Business support services",
    dataProcessingHostingRelatedServices: "Data processing, hosting, & related services",
    wirelessTelecommunicationCarriers: "Wireless telecommunication carriers",
    otherMotorVehicleParts: "Other motor vehicle parts",
    realEstateServices: "Real estate services",
    commercialInstitutionalBuildingConstruction: "Commercial & institutional building construction",
    computerPeripheralEquipment: "Computer & peripheral equipment",
    wiredTelecommunicationCarriers: "Wired telecommunication carriers",
    semiconductorsOtherElectronicComponents: "Semiconductors & other electronic components",
    medicalEquipmentSupplies: "Medical equipment & supplies",
    architecturalEngineeringRelatedServices: "Architectural, engineering, & related services",
    agricultureConstructionMiningMachinery: "Agriculture, construction, & mining machinery",
    steelProducts: "Steel products",
    managementConsultingServices: "Management consulting services",
    airTransportation: "Air transportation",
    otherSupportServices: "Other support services",
    solarElectricPower: "Solar electric power",
    motorVehicleGasolineEnginesEngineParts: "Motor vehicle gasoline engines & engine parts",
    clothingClothingAccessories: "Clothing & clothing accessories",
    measuringControlInstruments: "Measuring & control instruments",
    plasticsPackagingMaterialsUnlaminatedFilmSheets: "Plastics packaging materials & unlaminated film & sheets",
    audioVideoEquipment: "Audio & video equipment",
    warehousingStorage: "Warehousing & storage",
    cosmeticsPerfumePersonalCareHouseholdProducts: "Cosmetics, perfume, personal care & household products",
    oilGasExtraction: "Oil & gas extraction",
    otherFabricatedMetalProducts: "Other fabricated metal products",
    convertedPaperProducts: "Converted paper products",
    cementConcreteProducts: "Cement & concrete products",
    aircraftEnginesOtherPartsAuxiliaryEquipment: "Aircraft engines, other parts & auxiliary equipment",
    laminatedPlasticsPlatesSheetsShapes: "Laminated plastics plates, sheets & shapes",
    windElectricPower: "Wind electric power",
    rentalLeasingServices: "Rental & leasing services",
    residentialBuildingConstruction: "Residential building construction",
    officesOfPhysiciansDentistsOtherHealthcarePractitioners: "Offices of physicians, dentists, & other healthcare practitioners",
    travelArrangementReservationServices: "Travel arrangement & reservation services",
    biologicalProducts: "Biological products (except diagnostic)",
    motorVehicleElectricalElectronicEquipment: "Motor vehicle electrical & electronic equipment",
    powerTransmissionEquipment: "Power transmission equipment",
    aAircraft: "Aircraft",
    urethaneFoamProductsOtherCompounds: "Urethane, foam products & other compounds",
    otherPetroleumCoalProducts: "Other petroleum & coal products",
    ventilationHeatingAirConditioningAndCommercialRefrigerationEquipmentManufacturing: "Ventilation, heating, air conditioning, and commercial refrigeration equipment manufacturing",
    tyres: "Tyres",
    waterTransportation: "Water transportation",
    heavyDutyTrucks: "Heavy duty trucks",
    biomassPower: "Biomass power",
    householdAppliances: "Household appliances",
    fruitsVegetablesSpecialistFoods: "Fruits & vegetables & specialist foods ",
    aluminaAluminiumProductionAndProcessing: "Alumina & aluminium production and processing",
    enginesTurbines: "Engines & Turbines",
    furnitureHomewareRelatedProducts: "Furniture, homeware & related products (Consumer Products)",
    videoGamesApplicationsAndDigitalContent: "Video games, applications and digital content",
    accountingTaxPreparationBookkeepingPayrollServices: "Accounting, tax preparation, bookkeeping, & payroll services",
    industrialBuildingConstruction: "Industrial building construction",
    metalworkingMachinery: "Metalworking machinery",
    computerSystemsDesignServices: "Computer systems design services",
    motorVehicleSeatingInteriorTrim: "Motor vehicle seating & interior trim",
    heavyCivilEngineering: "Heavy & civil engineering",
    dairyProducts: "Dairy products",
    allOtherIndustrialMachinery: "All other industrial machinery",
    softDrinksIce: "Soft drinks & ice",
    schoolsCollegesUniversitiesProfessionalSchools: "Schools, colleges, universities, & professional schools",
    grainsOilseed: "Grains & oilseed",
    motorVehicleSteeringSuspensionComponents: "Motor vehicle steering & suspension components",
    sugarConfectionaryProducts: "Sugar & confectionary products",
    radioTvBroadcasting: "Radio & TV broadcasting",
    goldOreSilverOreMining: "Gold ore & silver ore mining",
    glassGlassProducts: "Glass & glass products",
    pesticideFertilisersOtherAgriculturalChemicals: "Pesticide, fertilisers & other agricultural chemicals",
    outpatientCareCentresMedicalDiagnosticLaboratories: "Outpatient care centres & medical & diagnostic laboratories",
    breweriesDistilleries: "Breweries & distilleries",
    motorVehicleBodyTrailers: "Motor vehicle body & trailers",
    woodProducts: "Wood products",
    nonstoreRetailers: "Nonstore retailers",
    motionPictureSoundRecordingIndustries: "Motion picture & sound recording industries",
    shipsBoats: "Ships & boats",
    textilesTextileMills: "Textiles & Textile Mills",
    electricLightingEquipment: "Electric lighting equipment",
    foodBeverageStores: "Food & Beverage Stores (Food & Tobacco)",
    naturalLiquefiedAndCompressedGas: "Natural, liquefied and compressed gas"
    }


    export const regionOptions = {
    asia: "Asia (Ex. Near East)",
    baltics: "Baltics",
    cWOfIndStates: "C.W. Of Ind. States",
    easternEurope: "Eastern Europe",
    latinAmerAndCarib: "Latin Amer. & Carib",
    nearEast: "Near East",
    northernAfrica: "Northern Africa",
    northernAmerica: "Northern America",
    oceania: "Oceania",
    subSaharanAfrica: "Sub-Saharan Africa",
    westernEurope: "Western Europe Asia (Ex. Near East)"
    }

    export const countries = {
      afghanistan:  "Afghanistan",
      albania:  "Albania",
      algeria:  "Algeria",
      americanSamoa:  "American Samoa",
      andorra:  "Andorra",
      angola:  "Angola",
      anguilla:  "Anguilla",
      antiguaBarbuda:  "Antigua & Barbuda",
      argentina:  "Argentina",
      armenia:  "Armenia",
      aruba:  "Aruba",
      australia:  "Australia",
      austria:  "Austria",
      azerbaijan:  "Azerbaijan",
      bahamas:  "Bahamas, The",
      bahrain:  "Bahrain",
      bangladesh:  "Bahrain",
      barbados:  "Barbados",
      belarus:  "Belarus",
      belgium:  "Belgium",
      belize:  "Belize",
      benin:  "Benin",
      bermuda:  "Bermuda",
      bhutan:  "Bhutan",
      bolivia:  "Bolivia",
      bosniaHerzegovina:  "Bosnia & Herzegovina",
      botswana:  "Botswana",
      brazil:  "Brazil",
      britishVirginIs:  "British Virgin Is.",
      brunei:  "Brunei",
      bulgaria:  "Bulgaria",
      burkinaFaso:  "Burkina Faso",
      burma:  "Burma",
      burundi:  "Burma",
      cambodia:  "Cambodia",
      cameroon:  "Cameroon",
      canada:  "Canada",
      capeVerde:  "Cape Verde",
      caymanIslands:  "Cayman Islands",
      centralAfricanRep:  "Central African Rep.",
      chad:  "Chad",
      chile:  "Chile",
      china:  "China",
      colombia:  "Colombia",
      comoros:  "Comoros",
      congoDemRep:  "Congo, Dem. Rep.",
      congoRepubofthe:  "Congo, Repub. of the",
      cookIslands:  "Cook Islands",
      costaRica:  "Costa Rica",
      cotedIvoire:  "Cote d'Ivoire",
      croatia:  "Croatia",
      cuba:  "Cuba",
      cyprus:  "Cyprus",
      czechRepublic:  "Czech Republic",
      denmark:  "Denmark",
      djibouti:  "Djibouti",
      dominica:  "Dominica",
      dominicanRepublic:  "Dominican Republic",
      eastTimor:  "East Timor",
      ecuador:  "Ecuador",
      egypt:  "Egypt",
      elSalvador:  "El Salvador",
      equatorialGuinea:  "Equatorial Guinea",
      eritrea:  "Eritrea",
      estonia:  "Estonia",
      ethiopia:  "Ethiopia",
      faroeIslands:  "Faroe Islands",
      fiji:  "Fiji",
      finland:  "Finland",
      france:  "France",
      frenchGuiana:  "French Guiana",
      frenchPolynesia:  "French Polynesia",
      gabon:  "Gabon",
      gambiaThe:  "Gambia, The",
      gazaStrip:  "Gaza Strip",
      georgia:  "Georgia",
      germany:  "Germany",
      ghana:  "Ghana",
      gibraltar:  "Gibraltar",
      greece:  "Greece",
      greenland:  "Greenland",
      grenada:  "Grenada",
      guadeloupe:  "Guadeloupe",
      guam:  "Guam",
      guatemala:  "Guatemala",
      guernsey:  "Guernsey",
      guinea:  "Guinea",
      guineaBissau:  "Guinea-Bissau",
      guyana:  "Guyana",
      haiti:  "Haiti",
      honduras:  "Honduras",
      hongKong:  "Hong Kong",
      hungary:  "Hungary",
      iceland:  "Iceland",
      india:  "India",
      indonesia:  "Indonesia",
      iran:  "Iran",
      iraq:  "Iraq",
      ireland:  "Ireland",
      isleofMan:  "Isle of Man",
      israel:  "Israel",
      italy:  "Italy",
      jamaica:  "Jamaica",
      japan:  "Japan",
      jersey:  "Jersey",
      jordan:  "Jordan",
      kazakhstan:  "Kazakhstan",
      kenya:  "Kenya",
      kiribati:  "Kiribati",
      northKorea:  "Korea, North",
      southKorea:  "Korea, South",
      kuwait:  "Kuwait",
      kyrgyzstan:  "Kyrgyzstan",
      laos:  "Laos",
      latvia:  "Latvia",
      lebanon:  "Lebanon",
      lesotho:  "Lesotho",
      liberia:  "Liberia",
      libya:  "Libya",
      liechtenstein:  "Liechtenstein",
      lithuania:  "Lithuania",
      luxembourg:  "Luxembourg",
      macau:  "Macau",
      macedonia:  "Macedonia",
      madagascar:  "Madagascar",
      malawi:  "Malawi",
      malaysia:  "Malaysia",
      maldives:  "Maldives",
      mali:  "Mali",
      malta:  "Malta",
      marshallIslands:  "Marshall Islands",
      martinique:  "Martinique",
      mauritania:  "Mauritania",
      mauritius:  "Mauritius",
      mayotte:  "Mayotte",
      mexico:  "Mexico",
      micronesiaFedSt:  "Micronesia, Fed. St.",
      moldova:  "Moldova",
      monaco:  "Monaco",
      mongolia:  "Mongolia",
      montserrat:  "Montserrat",
      morocco:  "Morocco",
      mozambique:  "Mozambique",
      namibia:  "Namibia",
      nauru:  "Nauru",
      nepal:  "Nepal",
      netherlands:  "Netherlands",
      netherlandsAntilles:  "Netherlands Antilles",
      newCaledonia:  "New Caledonia",
      newZealand:  "New Zealand",
      nicaragua:  "Nicaragua",
      niger:  "Niger",
      nigeria:  "Nigeria",
      nMarianaIslands:  "N. Mariana Islands",
      norway:  "Norway",
      oman:  "Oman",
      pakistan:  "Pakistan",
      palau:  "Palau",
      panama:  "Panama",
      papuaNewGuinea:  "Papua New Guinea",
      paraguay:  "Paraguay",
      peru:  "Peru",
      philippines:  "Philippines",
      poland:  "Poland",
      portugal:  "Portugal",
      puertoRico:  "Puerto Rico",
      qatar:  "Qatar",
      reunion:  "Reunion",
      romania:  "Romania",
      russia:  "Russia",
      rwanda:  "Rwanda",
      saintHelena:  "Saint Helena",
      saintKittsNevis:  "Saint Kitts & Nevis",
      saintLucia:  "Saint Lucia",
      stPierreMiquelon:  "St Pierre & Miquelon",
      saintVincentandtheGrenadines:  "Saint Vincent and the Grenadines",
      samoa:  "Samoa",
      sanMarino:  "San Marino",
      saoTomePrincipe:  "Sao Tome & Principe",
      saudiArabia:  "Saudi Arabia",
      senegal:  "Senegal",
      serbia:  "Serbia",
      seychelles:  "Seychelles",
      sierraLeone:  "Sierra Leone",
      singapore:  "Singapore",
      slovakia:  "Slovakia",
      slovenia:  "Slovenia",
      solomonIslands:  "Solomon Islands",
      somalia:  "Somalia",
      southAfrica:  "South Africa",
      spain:  "Spain",
      sriLanka:  "Sri Lanka",
      sudan:  "Sudan",
      suriname:  "Suriname",
      swaziland:  "Swaziland",
      sweden:  "Sweden",
      switzerland:  "Switzerland",
      syria:  "Syria",
      taiwan:  "Taiwan",
      tajikistan:  "Tajikistan",
      tanzania:  "Tanzania",
      thailand:  "Thailand",
      togo:  "Togo",
      tonga:  "Tonga",
      trinidadTobago:  "Trinidad & Tobago",
      tunisia:  "Tunisia",
      turkey:  "Turkey",
      turkmenistan:  "Turkmenistan",
      turksCaicosIs:  "Turks & Caicos Is",
      tuvalu:  "Tuvalu",
      uganda:  "Uganda",
      ukraine:  "Ukraine",
      unitedArabEmirates:  "United Arab Emirates",
      unitedKingdom:  "United Kingdom",
      unitedStates:  "United States",
      uruguay:  "Uruguay",
      uzbekistan:  "Uzbekistan",
      vanuatu:  "Vanuatu",
      venezuela:  "Venezuela",
      vietnam:  "Vietnam",
      virginIslands:  "Virgin Islands",
      wallisandFutuna:  "Wallis and Futuna",
      westBank:  "West Bank",
      westernSahara:  "Western Sahara",
      yemen:  "Yemen",
      zambia:  "Zambia",
      zimbabwe:  "Zimbabwe"
      }