export interface NavLink {
  label: string;
  href: string;
  icon: string;
}

export interface DropdownOption {
  label: string;
  value: string;
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

export const dropdownOptions: Record<string, DropdownOption[]> = {
  'Fulfillment': [
    { label: 'Orders', value: '/fulfillment/orders' },
    { label: 'Inventory', value: '/fulfillment/inventory' },
    { label: 'Shipping', value: '/fulfillment/shipping' }
  ],
  'Analytics': [
    { label: 'Dashboard', value: '/analytics/dashboard' },
    { label: 'Reports', value: '/analytics/reports' },
    { label: 'Insights', value: '/analytics/insights' }
  ],
  'Google Ads': [
    { label: 'Campaigns', value: '/google-ads/campaigns' },
    { label: 'Keywords', value: '/google-ads/keywords' },
    { label: 'Performance', value: '/google-ads/performance' }
  ],
  'Tools': [
    { label: 'Calculator', value: '/tools/calculator' },
    { label: 'Generator', value: '/tools/generator' },
    { label: 'Converter', value: '/tools/converter' }
  ]
};
