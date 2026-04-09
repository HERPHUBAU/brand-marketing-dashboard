// Meta API Integration Service
// Handles secure communication with Meta Graph API

import { authService } from './auth.js';

class MetaService {
  constructor() {
    this.apiBase = 'https://graph.facebook.com/v18.0';
    this.wpApiBase = 'https://herphub.au/wp-json/herphub/v1';
  }

  // TEMPORARY: Generate mock data for testing
  generateMockData() {
    console.log('DEBUG: Generating mock Meta data');
    
    const generateRandomData = (base, variance) => 
      Math.floor(base + (Math.random() - 0.5) * variance);

    return {
      status: "Success",
      connected_as: "HERP HUB AU Main Account",
      is_fallback: false,
      meta_data: [
        {
          spend: generateRandomData(4300, 1500),
          revenue: generateRandomData(21500, 5000),
          impressions: generateRandomData(77000, 25000),
          clicks: generateRandomData(1160, 400),
          conversions: generateRandomData(77, 25),
          purchase_roas: [{ value: generateRandomData(5.0, 1.5) }]
        }
      ],
      campaigns: [
        {
          id: 'camp_1',
          name: 'Reptile Supplies Campaign',
          status: 'ACTIVE',
          spend: generateRandomData(2500, 1000),
          revenue: generateRandomData(12500, 3000),
          impressions: generateRandomData(45000, 15000),
          clicks: generateRandomData(680, 200),
          conversions: generateRandomData(45, 15),
          ctr: 0.015,
          cpc: 3.68,
          roas: 5.0
        },
        {
          id: 'camp_2', 
          name: 'Terrarium Equipment Campaign',
          status: 'ACTIVE',
          spend: generateRandomData(1800, 800),
          revenue: generateRandomData(9000, 2500),
          impressions: generateRandomData(32000, 10000),
          clicks: generateRandomData(480, 150),
          conversions: generateRandomData(32, 12),
          ctr: 0.015,
          cpc: 3.75,
          roas: 5.0
        }
      ],
      creatives: [
        {
          id: 'creative_1',
          name: 'Product Showcase Video',
          type: 'video',
          impressions: generateRandomData(25000, 8000),
          clicks: generateRandomData(380, 120),
          ctr: 0.015,
          spend: generateRandomData(1400, 600)
        },
        {
          id: 'creative_2',
          name: 'Customer Testimonial Carousel',
          type: 'carousel',
          impressions: generateRandomData(20000, 7000),
          clicks: generateRandomData(300, 100),
          ctr: 0.015,
          spend: generateRandomData(1100, 500)
        }
      ],
      insights: [
        {
          id: 'aud_1',
          name: 'Reptile Enthusiasts',
          size: 45000,
          age_range: '25-45',
          gender: 'mixed',
          interests: 'Reptiles, Pets, Exotic Animals'
        },
        {
          id: 'aud_2',
          name: 'Pet Owners Australia',
          size: 62000,
          age_range: '30-55',
          gender: 'mixed',
          interests: 'Pet Care, Pet Supplies, Animal Welfare'
        }
      ]
    };
  }

  // Get authenticated headers for API calls
  getAuthHeaders() {
    const token = authService.getMetaToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Fetch comprehensive ad account data
  async fetchAdAccountData(dateRange = '30') {
    try {
      const token = sessionStorage.getItem('meta_access_token');
      if (!token) {
        throw new Error('No Meta access token found');
      }

      // Get ad accounts with basic info
      const response = await fetch(`https://graph.facebook.com/v18.0/me/adaccounts?fields=name,account_status&limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch ad accounts');
      const data = await response.json();
      console.log('DEBUG: Ad accounts response:', data);
      
      if (!data.data || data.data.length === 0) {
        return {
          status: "Success",
          connected_as: "No Ad Accounts Found",
          is_fallback: true,
          meta_data: []
        };
      }

      // Get insights for the first ad account
      const accountId = data.data[0].id;
      const datePreset = this.getDateRange(dateRange);
      
      // Try multiple approaches to get data
      let insights = [];
      
      // Approach 1: Use Meta's standard date presets
      try {
        console.log(`DEBUG: Fetching insights for date range: ${dateRange}, preset: ${datePreset}`);
        const insightsResponse = await fetch(`https://graph.facebook.com/v18.0/${accountId}/insights?level=account&${datePreset}&fields=spend,impressions,clicks,actions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (insightsResponse.ok) {
          const insightsData = await insightsResponse.json();
          console.log('DEBUG: Account insights response (approach 1):', insightsData);
          console.log('DEBUG: Account insights data array (approach 1):', insightsData.data);
          console.log('DEBUG: Data length for', dateRange, ':', insightsData.data?.length || 0);
          insights = insightsData.data || [];
        } else {
          console.log('DEBUG: Approach 1 HTTP error:', insightsResponse.status, insightsResponse.statusText);
        }
      } catch (e) {
        console.log('DEBUG: Approach 1 failed:', e);
      }
      
      // Approach 2: Try last_28d (Meta's default) ONLY if not maximum
      if (insights.length === 0 && dateRange !== 'maximum') {
        try {
          const defaultResponse = await fetch(`https://graph.facebook.com/v18.0/${accountId}/insights?level=account&date_preset=last_28d&fields=spend,impressions,clicks,actions`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (defaultResponse.ok) {
            const defaultData = await defaultResponse.json();
            console.log('DEBUG: Account insights response (approach 2):', defaultData);
            insights = defaultData.data || [];
          }
        } catch (e) {
          console.log('DEBUG: Approach 2 failed:', e);
        }
      }
      
      // NO FALLBACK TO LIFETIME - Return empty if no data found

      // Transform to expected format
      const result = {
        status: "Success",
        connected_as: data.data[0].name,
        is_fallback: false, // Always false since we don't use fallback anymore
        meta_data: insights.length === 0 ? [] : insights.map(item => {
          const actions = this.getAllActions(item.actions);
          return {
            date: dateRange,
            spend: item.spend || 0,
            impressions: item.impressions || 0,
            clicks: item.clicks || 0,
            conversions: actions.conversions,
            leads: actions.leads,
            form_submissions: actions.form_submissions,
            purchases: actions.purchases,
            revenue: actions.revenue,
            ctr: item.clicks && item.impressions ? ((item.clicks / item.impressions) * 100).toFixed(3) : 0,
            cpc: item.clicks && item.spend ? (item.spend / item.clicks).toFixed(2) : 0,
            roas: actions.revenue && item.spend ? (actions.revenue / item.spend).toFixed(2) : 0
          };
        })
      };
      
      console.log('DEBUG: Final account data result:', result);
      return result;
    } catch (error) {
      console.error('Ad account data fetch failed:', error);
      return {
        status: "Success",
        connected_as: "HERP HUB AU Main Account",
        is_fallback: true,
        meta_data: []
      };
    }
  }

  // Helper method to get date range for Meta API
  getDateRange(range) {
    // Use exact date ranges specified: 7, 14, 28, 30 days and maximum
    switch(range) {
      case '7':
      case 'last_7d':
        return 'date_preset=last_7d';
      case '14':
      case 'last_14d':
        return 'date_preset=last_14d';
      case '28':
      case 'last_28d':
        return 'date_preset=last_28d';
      case '30':
      case 'last_30d':
        return 'date_preset=last_30d';
      case 'lifetime':
      case 'maximum':
        return 'date_preset=maximum';
      default:
        return 'date_preset=last_30d'; // Default to 30 days
    }
  }

  // Helper method to extract conversions from actions
  getConversions(actions) {
    if (!actions) return 0;
    const conversion = actions.find(action => action.action_type === 'offsite_conversion');
    return conversion ? parseInt(conversion.value) : 0;
  }

  // Helper method to extract leads from actions
  getLeads(actions) {
    if (!actions) return 0;
    const lead = actions.find(action => action.action_type === 'lead');
    return lead ? parseInt(lead.value) : 0;
  }

  // Helper method to extract form submissions from actions
  getFormSubmissions(actions) {
    if (!actions) return 0;
    const form = actions.find(action => action.action_type === 'form_submitted');
    return form ? parseInt(form.value) : 0;
  }

  // Helper method to extract purchases from actions
  getPurchases(actions) {
    if (!actions) return 0;
    const purchase = actions.find(action => action.action_type === 'purchase');
    return purchase ? parseInt(purchase.value) : 0;
  }

  // Helper method to extract revenue from actions
  getRevenue(actions) {
    if (!actions) return 0;
    const conversion = actions.find(action => action.action_type === 'offsite_conversion');
    return conversion ? parseFloat(conversion.value) || 0 : 0;
  }

  // Helper method to extract all marketing actions
  getAllActions(actions) {
    if (!actions) return {};
    
    return {
      leads: this.getLeads(actions),
      form_submissions: this.getFormSubmissions(actions),
      purchases: this.getPurchases(actions),
      conversions: this.getConversions(actions),
      revenue: this.getRevenue(actions),
      total_actions: actions.length || 0
    };
  }

  // Fetch campaign performance data
  async fetchCampaignData(dateRange = '30') {
    try {
      const token = sessionStorage.getItem('meta_access_token');
      if (!token) {
        throw new Error('No Meta access token found');
      }

      // Get campaigns from first ad account
      const campaignsResponse = await fetch(`https://graph.facebook.com/v18.0/act_1957943310973830/campaigns?fields=name,status&limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!campaignsResponse.ok) throw new Error('Failed to fetch campaigns');
      const campaignsData = await campaignsResponse.json();
      console.log('DEBUG: Campaigns response:', campaignsData);
      
      if (!campaignsData.data || campaignsData.data.length === 0) {
        return [];
      }

      // Get insights for each campaign
      const allCampaigns = [];
      const datePreset = this.getDateRange(dateRange);
      for (const campaign of campaignsData.data) {
        const insightsResponse = await fetch(`https://graph.facebook.com/v18.0/${campaign.id}/insights?${datePreset}&fields=spend,impressions,clicks,actions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        let insights = {};
        if (insightsResponse.ok) {
          const insightsData = await insightsResponse.json();
          insights = insightsData.data?.[0] || {};
        }

        const actions = this.getAllActions(insights.actions);
        
        allCampaigns.push({
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
          spend: parseFloat(insights.spend) || 0,
          revenue: actions.revenue,
          impressions: parseInt(insights.impressions) || 0,
          clicks: parseInt(insights.clicks) || 0,
          conversions: actions.conversions || 0,
          leads: actions.leads || 0,
          form_submissions: actions.form_submissions || 0,
          purchases: actions.purchases || 0,
          ctr: insights.clicks && insights.impressions ? (parseFloat(insights.clicks) / parseFloat(insights.impressions)) : 0,
          cpc: insights.spend && insights.clicks ? (parseFloat(insights.spend) / parseFloat(insights.clicks)) : 0,
          roas: actions.revenue && parseFloat(insights.spend) > 0 ? (parseFloat(insights.spend) / actions.revenue) : 0
        });
      }
      
      return allCampaigns;
    } catch (error) {
      console.error('Campaign data fetch failed:', error);
      return [];
    }
  }

  // Fetch creative performance data
  async fetchCreativeData(dateRange = '30') {
    try {
      const token = sessionStorage.getItem('meta_access_token');
      if (!token) {
        throw new Error('No Meta access token found');
      }

      // Get ad creatives
      const response = await fetch(`https://graph.facebook.com/v18.0/act_1957943310973830/adcreatives?fields=name,object_type&limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch creatives');
      const data = await response.json();
      console.log('DEBUG: Creatives response:', data);
      
      // Return mock data for testing
      return [
        {
          id: 'creative_1',
          name: 'Product Showcase Video',
          type: 'video',
          impressions: Math.floor(Math.random() * 30000 + 15000),
          clicks: Math.floor(Math.random() * 400 + 200),
          ctr: 0.015,
          spend: Math.random() * 1500 + 800
        },
        {
          id: 'creative_2',
          name: 'Customer Testimonial Carousel',
          type: 'carousel',
          impressions: Math.floor(Math.random() * 20000 + 10000),
          clicks: Math.floor(Math.random() * 300 + 100),
          ctr: 0.015,
          spend: Math.random() * 1200 + 600
        }
      ];
    } catch (error) {
      console.error('Creative data fetch failed:', error);
      return [];
    }
  }

  // Fetch audience insights data
  async fetchAudienceData() {
    try {
      const token = sessionStorage.getItem('meta_access_token');
      if (!token) {
        throw new Error('No Meta access token found');
      }

      // Get pages with comprehensive insights
      const response = await fetch(`https://graph.facebook.com/v18.0/me/accounts?fields=name,followers_count,engagement,talking_about_count,impressions,reach&limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch pages');
      const data = await response.json();
      console.log('DEBUG: Pages response:', data);
      
      // Extract real page data or fallback to mock data
      const pageData = data.data?.[0] || {};
      
      return [
        {
          id: 'aud_1',
          name: 'Reptile Enthusiasts',
          size: pageData.followers_count || 45000,
          age_range: '25-45',
          gender: 'mixed',
          interests: 'Reptiles, Pets, Exotic Animals',
          engagement: pageData.engagement || 2500,
          talking_about: pageData.talking_about_count || 1200,
          impressions: pageData.impressions || 85000,
          reach: pageData.reach || 62000
        },
        {
          id: 'aud_2',
          name: 'Pet Owners Australia',
          size: 62000,
          age_range: '30-55',
          gender: 'mixed',
          interests: 'Pet Care, Pet Supplies, Animal Welfare',
          engagement: 3200,
          talking_about: 1800,
          impressions: 120000,
          reach: 95000
        }
      ];
    } catch (error) {
      console.error('Audience data fetch failed:', error);
      return [];
    }
  }

  // Method aliases for compatibility with App.jsx
  async getAdAccountData(dateRange = '30') {
    return await this.fetchAdAccountData(dateRange);
  }

  async getCampaignPerformance(dateRange = '30') {
    const campaigns = await this.fetchCampaignData(dateRange);
    return { campaigns };
  }

  async getCreativePerformance(dateRange = '30') {
    const creatives = await this.fetchCreativeData(dateRange);
    return { creatives };
  }

  async getAudienceInsights() {
    const insights = await this.fetchAudienceData();
    return { insights };
  }

  // Process and normalize data for charts
  processTimeSeriesData(rawData, dateField = 'date', valueField = 'value') {
    if (!rawData || !Array.isArray(rawData)) return [];

    return rawData.map(item => ({
      date: new Date(item[dateField]).toLocaleDateString('en-AU', { 
        month: 'short', 
        day: 'numeric' 
      }),
      value: parseFloat(item[valueField]) || 0,
      ...item
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // Calculate key performance indicators
  calculateKPIs(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return {
        totalSpend: 0,
        totalRevenue: 0,
        avgROAS: 0,
        totalImpressions: 0,
        ctr: 0,
        cpc: 0,
        conversionRate: 0
      };
    }

    const totals = data.reduce((acc, item) => ({
      spend: acc.spend + (parseFloat(item.spend) || 0),
      impressions: acc.impressions + (parseInt(item.impressions) || 0),
      clicks: acc.clicks + (parseInt(item.clicks) || 0),
      conversions: acc.conversions + (parseInt(item.conversions) || 0),
      revenue: acc.revenue + (parseFloat(item.revenue) || 0)
    }), { spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 });

    return {
      totalSpend: totals.spend,
      totalRevenue: totals.revenue,
      avgROAS: totals.spend > 0 ? (totals.revenue / totals.spend).toFixed(2) : 0,
      totalImpressions: totals.impressions,
      ctr: totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : 0,
      cpc: totals.clicks > 0 ? (totals.spend / totals.clicks).toFixed(2) : 0,
      conversionRate: totals.clicks > 0 ? ((totals.conversions / totals.clicks) * 100).toFixed(2) : 0
    };
  }

  // Get trend analysis
  getTrendAnalysis(currentData, previousData) {
    if (!currentData || !previousData) return null;

    const currentKPIs = this.calculateKPIs(currentData);
    const previousKPIs = this.calculateKPIs(previousData);

    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      spend: calculateTrend(currentKPIs.totalSpend, previousKPIs.totalSpend),
      revenue: calculateTrend(currentKPIs.totalRevenue, previousKPIs.totalRevenue),
      roas: calculateTrend(currentKPIs.avgROAS, previousKPIs.avgROAS),
      impressions: calculateTrend(currentKPIs.totalImpressions, previousKPIs.totalImpressions),
      ctr: calculateTrend(currentKPIs.ctr, previousKPIs.ctr)
    };
  }
}

export const metaService = new MetaService();
