import { calculateAllOrderCancelStatus, 
  calculateAllOrderCompleteStatus, 
  calculateAllOrderCreateStatus, 
  calculateAllOrderDuplicateStatus, 
  calculateAllOrderErrorStatus, 
  calculateAllOrderProcessStatus 
} from "@/lib/utils";

export interface NavLink {
  label: string;
  href: string;
  icon: string;
}

export interface DropdownOption {
  label: string;
  value: string;
  icon: string;
}

// Order interfaces
export interface LineItem {
  itemId: string;
  quantity: number;
  cost: string;
  sku: string;
  carrier: string;
  trackingNo: string;
  images?: {
    double?: string;
    love?: string;
  };
}

export interface Order {
  orderId: string;
  status: string;
  lineItems: LineItem[];
  shippingAddress: string;
  createdAt: string;
}

export const navLink: NavLink[] = [
  {'label': 'Home', 'href': '/', 'icon': 'dashboard'},
  {'label': 'Posts ID', 'href': '/PostsID', 'icon': 'article'},
  {'label': 'Fanpage', 'href': '/Fanpage', 'icon': 'group'},
  {'label': 'Ads Library', 'href': '/AdsLibrary', 'icon': 'folder'},
  {'label': 'Report', 'href': '/Report', 'icon': 'bar_chart'},
  {'label': 'Fulfillment', 'href': '/Fulfillment', 'icon': 'inventory'},
  {'label': 'Analytics', 'href': '/Analytics', 'icon': 'trending_up'},
  {'label': 'Tiktok Ads', 'href': '/TiktokAds', 'icon': 'play_circle'},
  {'label': 'Google Ads', 'href': '/GoogleAds', 'icon': 'campaign'},
  {'label': 'Tools', 'href': '/Tools', 'icon': 'handyman'},
  {'label': 'Config', 'href': '/Config', 'icon': 'tune'},
];

// Social Links data
export const socialLinks = {
  linkedin: 'https://linkedin.com/in/aluffm',
  twitter: 'https://twitter.com/aluffm',
  facebook: 'https://facebook.com/aluffm',
  instagram: 'https://instagram.com/aluffm',
  website: 'https://aluffm.com'
};

export const dropdownOptions: Record<string, DropdownOption[]> = {
  'Fulfillment': [
    { label: 'Orders', value: '/fulfillment/orders', icon: 'shopping_cart' },
    { label: 'Inventory', value: '/fulfillment/inventory', icon: 'inventory_2' },
    { label: 'Shipping', value: '/fulfillment/shipping', icon: 'local_shipping' }
  ],
  'Analytics': [
    { label: 'Dashboard', value: '/analytics/dashboard', icon: 'dashboard' },
    { label: 'Reports', value: '/analytics/reports', icon: 'assessment' },
    { label: 'Insights', value: '/analytics/insights', icon: 'trending_up' }
  ],
  'Google Ads': [
    { label: 'Campaigns', value: '/google-ads/campaigns', icon: 'campaign' },
    { label: 'Keywords', value: '/google-ads/keywords', icon: 'key' },
    { label: 'Performance', value: '/google-ads/performance', icon: 'analytics' }
  ],
  'Tools': [
    { label: 'Calculator', value: '/tools/calculator', icon: 'calculate' },
    { label: 'Generator', value: '/tools/generator', icon: 'auto_fix_high' },
    { label: 'Converter', value: '/tools/converter', icon: 'transform' }
  ],
  'User': [
    { label: 'Profile', value: '/Profile', icon: 'person' },
    { label: 'Settings', value: '/Settings', icon: 'settings' },
    { label: 'Sign Out', value: '/SignOut', icon: 'logout' }
  ]
};

export const orders: Order[] = [
  {
    orderId: "#WRG1368833842",
    status: "Done",
    lineItems: [
      {
        itemId: "15668529103125",
        quantity: 1,
        cost: "$8.05",
        sku: "Suncatcher-4inch",
        carrier: "USPS",
        trackingNo: "420183249261290339715411184138",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    
    shippingAddress: "Paula Warren, 112 Buxton Ct, Bushkill, PA, 18324, US",
    createdAt: "01/01/2025, 08:15"
  },
  {
    orderId: "#WRG1368823137",
    status: "Done",
    lineItems: [
      {
        itemId: "15665768333589",
        quantity: 1,
        cost: "$5.73",
        sku: "Suncatcher-4inch",
        carrier: "USPS",
        trackingNo: "420754079261290339715411153967",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      },
      {
        itemId: "15665768333590",
        quantity: 1,
        cost: "$5.73",
        sku: "Suncatcher-4inch",
        carrier: "USPS",
        trackingNo: "420754079261290339715411153967",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],

    shippingAddress: "Dawn Moody, 6546 August Dr, Princeton, TX, 75407, US",
    createdAt: "15/01/2025, 14:20"
  },
  {
    orderId: "#WRG1368830974-S1",
    status: "Done",
    lineItems: [
      {
        itemId: "15663872213269",
        quantity: 1,
        cost: "$9.55",
        sku: "Wooden-Plaque-Horizontal-Base1-5inch",
        carrier: "USPS",
        trackingNo: "420750989261290339715411185272",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    
    shippingAddress: "Rosa Rivera, 130 Gary Way, Wylie, TX, 75098, US",
    createdAt: "02/02/2025, 09:45"
  },
  {
    orderId: "#WRG1368830960",
    status: "Done",
    lineItems: [
      {
        itemId: "15663848390933",
        quantity: 1,
        cost: "$9.55",
        sku: "Wooden-Plaque-Horizontal-Base1-5inch",
        carrier: "USPS",
        trackingNo: "420760929261290339715411155237",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    
    shippingAddress: "Sofie Danish, 504 Saint Tropez Drive, Southlake, TX, 76092, US",
    createdAt: "18/02/2025, 11:30"
  },
  {
    orderId: "#WRG1368830709",
    status: "Done",
    lineItems: [
      {
        itemId: "15663634514197",
        quantity: 1,
        cost: "$9.05",
        sku: "Suncatcher-6inch",
        carrier: "USPS",
        trackingNo: "420130369261290339715411175273",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
   
    shippingAddress: "Candace Black, 443 County Route 4, Central Square, NY, 13036, US",
    createdAt: "05/03/2025, 16:55"
  },
  {
    orderId: "#WRG1368830866",
    status: "Done",
    lineItems: [
      {
        itemId: "15663749464341",
        quantity: 1,
        cost: "$7.00",
        sku: "VerticalOrnament-size5.5",
        carrier: "USPS",
        trackingNo: "420894089261290339715411165250",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    
    shippingAddress: "Melissa Bott, 229 Amber Ct, Fernley, NV, 89408, US",
    createdAt: "21/03/2025, 10:10"
  },
  {
    orderId: "#WRG1368830756",
    status: "Done",
    lineItems: [
      {
        itemId: "1566366974261",
        quantity: 1,
        cost: "$10.55",
        sku: "Suncatcher-8inch",
        carrier: "USPS",
        trackingNo: "420337792261290339715411155220",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    
    shippingAddress: "Javier Morales, 125 W 187th St, Miami, FL, 33177, US",
    createdAt: "04/04/2025, 13:40"
  },
  {
    orderId: "#WRG1368826571.1",
    status: "Done",
    lineItems: [
      {
        itemId: "1565880987605",
        quantity: 1,
        cost: "$11.05",
        sku: "Suncatcher-8inch",
        carrier: "USPS",
        trackingNo: "420346089261290339715411155217",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    
    shippingAddress: "Alicia Perez, 11007 Clingman Street, Spring Hill, FL, 34608, US",
    createdAt: "19/04/2025, 07:25"
  },
  {
    orderId: "#WRG1368830700",
    status: "Done",
    lineItems: [
      {
        itemId: "1566369251413",
        quantity: 1,
        cost: "$10.55",
        sku: "Suncatcher-8inch",
        carrier: "USPS",
        trackingNo: "420856299261290339715411185265",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    
    shippingAddress: "Don FISKE, 373 W Vuelta Friso, Sahuarita, AZ, 85629, US",
    createdAt: "03/05/2025, 12:05"
  },
  {
    orderId: "#WRG1368830809",
    status: "Done",
    lineItems: [
      {
        itemId: "1566370320285",
        quantity: 1,
        cost: "$10.55",
        sku: "Suncatcher-8inch",
        carrier: "USPS",
        trackingNo: "420032882261290339715411150218",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],

    shippingAddress: "Julie Buckner, 3435 U.S. 3 Thornton NH 03285 House, Thornton, NH, US",
    createdAt: "17/05/2025, 18:50"
  },
  {
    orderId: "#PAW13681562944",
    status: "Done",
    lineItems: [
      {
        itemId: "1409293182548",
        quantity: 1,
        cost: "$10.55",
        sku: "Suncatcher-8inch",
        carrier: "USPS",
        trackingNo: "42010919261290339715411150236",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    
    shippingAddress: "Margaret Lake, 267 Seaman Rd P.O Box 261, Circleville, NY, 10919, US",
    createdAt: "01/06/2025, 09:35"
  },
  {
    orderId: "#PAW13681563439",
    status: "Done",
    lineItems: [
      {
        itemId: "1409335235284",
        quantity: 1,
        cost: "$10.55",
        sku: "Suncatcher-8inch",
        carrier: "USPS",
        trackingNo: "420802419261290339715411160200",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    
    shippingAddress: "Tory Ellis, 12255 Claude Court Apt 7, Northglenn, CO, 80241, US",
    createdAt: "15/06/2025, 21:15"
  },
  // Process Orders
  {
    orderId: "#WRG1368834001",
    status: "Process",
    lineItems: [
      {
        itemId: "15668529103126",
        quantity: 2,
        cost: "$12.99",
        sku: "Suncatcher-6inch",
        carrier: "FedEx",
        trackingNo: "420183249261290339715411184139",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    shippingAddress: "John Smith, 123 Main St, New York, NY, 10001, US",
    createdAt: "29/06/2025, 10:30"
  },
  {
    orderId: "#WRG1368834002",
    status: "Process",
    lineItems: [
      {
        itemId: "15668529103127",
        quantity: 1,
        cost: "$15.50",
        sku: "Wooden-Plaque-Horizontal-Base1-5inch",
        carrier: "UPS",
        trackingNo: "420183249261290339715411184140",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    shippingAddress: "Sarah Johnson, 456 Oak Ave, Los Angeles, CA, 90210, US",
    createdAt: "13/07/2025, 14:45"
  },
  // Error Orders
  {
    orderId: "#WRG1368834003",
    status: "Error",
    lineItems: [
      {
        itemId: "15668529103128",
        quantity: 1,
        cost: "$8.99",
        sku: "Suncatcher-4inch",
        carrier: "USPS",
        trackingNo: "420183249261290339715411184141",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    shippingAddress: "Mike Wilson, 789 Pine Rd, Chicago, IL, 60601, US",
    createdAt: "27/07/2025, 16:20"
  },
  {
    orderId: "#WRG1368834004",
    status: "Error",
    lineItems: [
      {
        itemId: "15668529103129",
        quantity: 3,
        cost: "$22.75",
        sku: "Suncatcher-8inch",
        carrier: "DHL",
        trackingNo: "420183249261290339715411184142",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    shippingAddress: "Lisa Brown, 321 Elm St, Miami, FL, 33101, US",
    createdAt: "10/08/2025, 18:15"
  },
  // Cancel Orders
  {
    orderId: "#WRG1368834005",
    status: "Cancel",
    lineItems: [
      {
        itemId: "15668529103130",
        quantity: 1,
        cost: "$11.25",
        sku: "Wooden-Plaque-Horizontal-Base1-5inch",
        carrier: "USPS",
        trackingNo: "420183249261290339715411184143",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    shippingAddress: "David Lee, 654 Maple Dr, Seattle, WA, 98101, US",
    createdAt: "24/08/2025, 09:10"
  },
  {
    orderId: "#WRG1368834006",
    status: "Cancel",
    lineItems: [
      {
        itemId: "15668529103131",
        quantity: 2,
        cost: "$18.50",
        sku: "Suncatcher-6inch",
        carrier: "FedEx",
        trackingNo: "420183249261290339715411184144",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    shippingAddress: "Emma Davis, 987 Cedar Ln, Boston, MA, 02101, US",
    createdAt: "07/09/2025, 11:30"
  },
  // Duplicate Orders
  {
    orderId: "#WRG1368834007",
    status: "Duplicate",
    lineItems: [
      {
        itemId: "15668529103132",
        quantity: 1,
        cost: "$9.99",
        sku: "Suncatcher-4inch",
        carrier: "USPS",
        trackingNo: "420183249261290339715411184145",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    shippingAddress: "Alex Turner, 147 Birch Ave, Denver, CO, 80201, US",
    createdAt: "21/09/2025, 13:45"
  },
  {
    orderId: "#WRG1368834008",
    status: "Duplicate",
    lineItems: [
      {
        itemId: "15668529103133",
        quantity: 1,
        cost: "$13.75",
        sku: "Wooden-Plaque-Horizontal-Base1-5inch",
        carrier: "UPS",
        trackingNo: "420183249261290339715411184146",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    shippingAddress: "Maria Garcia, 258 Spruce St, Phoenix, AZ, 85001, US",
    createdAt: "05/10/2025, 15:20"
  },
  // Create Orders
  {
    orderId: "#WRG1368834009",
    status: "Create",
    lineItems: [
      {
        itemId: "15668529103134",
        quantity: 1,
        cost: "$7.50",
        sku: "Suncatcher-4inch",
        carrier: "USPS",
        trackingNo: "420183249261290339715411184147",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    shippingAddress: "Tom Anderson, 369 Willow Rd, Portland, OR, 97201, US",
    createdAt: "19/10/2025, 20:30"
  },
  {
    orderId: "#WRG1368834010",
    status: "Create",
    lineItems: [
      {
        itemId: "15668529103135",
        quantity: 2,
        cost: "$16.80",
        sku: "Suncatcher-6inch",
        carrier: "FedEx",
        trackingNo: "420183249261290339715411184148",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      },
      {
        itemId: "15668529103136",
        quantity: 1,
        cost: "$12.25",
        sku: "Wooden-Plaque-Horizontal-Base1-5inch",
        carrier: "FedEx",
        trackingNo: "420183249261290339715411184149",
        images: {
          double: "/images/double.png",
          love: "/images/love.png"
        }
      }
    ],
    shippingAddress: "Jennifer White, 741 Poplar Dr, Austin, TX, 73301, US",
    createdAt: "02/11/2025, 22:15"
  }
];

// Status classes for table display
export const statusClasses = {
  create: 'tag has-background-grey has-text-white',
  process: 'tag has-background-primary has-text-white',
  done: 'tag is-success',
  cancel: 'tag is-danger',
  error: 'tag has-background-black has-text-white',
  duplicate: 'tag has-background-warning has-text-black'
} as const;

export const orderStatus = [
  {
    label: "All",
    value: orders.length.toLocaleString(),
    data: orders,
    color: { text: '#3273dc', background: '#f3f4f6' }
  },
  {
    label: "Create",
    value: calculateAllOrderCreateStatus(orders).length,
    data: calculateAllOrderCreateStatus(orders),
    color: { text: '#ffffff', background: '#7a7a7a' }
  },
  {
    label: "Process",
    value: calculateAllOrderProcessStatus(orders).length,
    data: calculateAllOrderProcessStatus(orders),
    color: { text: '#ffffff', background: '#3273dc' }
  },
  {
    label: "Done",
    value: calculateAllOrderCompleteStatus(orders).length,
    data: calculateAllOrderCompleteStatus(orders),
    color: { text: '#ffffff', background: '#48c774' }
  },
  {
    label: "Cancel",
    value: calculateAllOrderCancelStatus(orders).length,
    data: calculateAllOrderCancelStatus(orders),
    color: { text: '#ffffff', background: '#f14668' }
  },
  {
    label: "Error",
    value: calculateAllOrderErrorStatus(orders).length,
    data: calculateAllOrderErrorStatus(orders),
    color: { text: '#ffffff', background: '#000000' }
  },
  {
    label: "Duplicate",
    value: calculateAllOrderDuplicateStatus(orders).length,
    data: calculateAllOrderDuplicateStatus(orders),
    color: { text: '#000000', background: '#ffdd57' }
  }
]