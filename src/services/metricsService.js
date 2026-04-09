// Metrics Service - Manage customizable dashboard metrics

class MetricsService {
  constructor() {
    this.defaultMetrics = [
      // Marketing Performance
      {
        id: 'total_revenue',
        name: 'Total Revenue',
        category: 'marketing',
        type: 'currency',
        default: true,
        order: 1,
        threshold: { type: 'min', value: 0, good: 'higher' }
      },
      {
        id: 'roas',
        name: 'Return on Ad Spend',
        category: 'marketing',
        type: 'ratio',
        default: true,
        order: 2,
        threshold: { type: 'min', value: 2.0, good: 'higher' }
      },
      {
        id: 'total_leads',
        name: 'Total Leads',
        category: 'marketing',
        type: 'number',
        default: true,
        order: 3,
        threshold: { type: 'min', value: 0, good: 'higher' }
      },
      {
        id: 'conversion_rate',
        name: 'Conversion Rate',
        category: 'marketing',
        type: 'percentage',
        default: true,
        order: 4,
        threshold: { type: 'min', value: 2.0, good: 'higher' }
      },
      {
        id: 'cac',
        name: 'Customer Acquisition Cost',
        category: 'marketing',
        type: 'currency',
        default: false,
        order: 5,
        threshold: { type: 'max', value: 100, good: 'lower' }
      },
      
      // Brand Performance
      {
        id: 'total_followers',
        name: 'Total Followers',
        category: 'brand',
        type: 'number',
        default: true,
        order: 6,
        threshold: { type: 'min', value: 1000, good: 'higher' }
      },
      {
        id: 'engagement_rate',
        name: 'Engagement Rate',
        category: 'brand',
        type: 'percentage',
        default: true,
        order: 7,
        threshold: { type: 'min', value: 3.0, good: 'higher' }
      },
      {
        id: 'brand_reach',
        name: 'Brand Reach',
        category: 'brand',
        type: 'number',
        default: false,
        order: 8,
        threshold: { type: 'min', value: 10000, good: 'higher' }
      },
      {
        id: 'growth_rate',
        name: 'Social Growth Rate',
        category: 'brand',
        type: 'percentage',
        default: false,
        order: 9,
        threshold: { type: 'min', value: 5.0, good: 'higher' }
      },
      
      // Business Health
      {
        id: 'avg_order_value',
        name: 'Average Order Value',
        category: 'business',
        type: 'currency',
        default: false,
        order: 10,
        threshold: { type: 'min', value: 50, good: 'higher' }
      },
      {
        id: 'purchase_frequency',
        name: 'Purchase Frequency',
        category: 'business',
        type: 'number',
        default: false,
        order: 11,
        threshold: { type: 'min', value: 1.0, good: 'higher' }
      },
      {
        id: 'mql_count',
        name: 'Marketing Qualified Leads',
        category: 'business',
        type: 'number',
        default: false,
        order: 12,
        threshold: { type: 'min', value: 0, good: 'higher' }
      }
    ];
  }

  // Get user's saved metrics or default
  getUserMetrics(userId = 'default') {
    const saved = localStorage.getItem(`metrics_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved metrics:', e);
      }
    }
    return this.defaultMetrics.filter(m => m.default);
  }

  // Save user's metric preferences
  saveUserMetrics(userId, metrics) {
    try {
      localStorage.setItem(`metrics_${userId}`, JSON.stringify(metrics));
      return true;
    } catch (e) {
      console.error('Failed to save metrics:', e);
      return false;
    }
  }

  // Get all available metrics
  getAllMetrics() {
    return this.defaultMetrics;
  }

  // Update metric threshold
  updateThreshold(userId, metricId, threshold) {
    const metrics = this.getUserMetrics(userId);
    const metric = metrics.find(m => m.id === metricId);
    if (metric) {
      metric.threshold = threshold;
      this.saveUserMetrics(userId, metrics);
      return true;
    }
    return false;
  }

  // Reorder metrics
  reorderMetrics(userId, metricIds) {
    const allMetrics = this.getAllMetrics();
    const reordered = metricIds.map((id, index) => {
      const metric = allMetrics.find(m => m.id === id);
      if (metric) {
        return { ...metric, order: index + 1 };
      }
      return null;
    }).filter(Boolean);

    this.saveUserMetrics(userId, reordered);
    return reordered;
  }

  // Calculate metric value based on data
  calculateMetricValue(metricId, data) {
    const { realStats, audienceData, totalSpend, totalRevenue } = data;

    switch (metricId) {
      case 'total_revenue':
        return totalRevenue || 0;
      
      case 'roas':
        return totalSpend > 0 ? (totalRevenue / totalSpend) : 0;
      
      case 'total_leads':
        return realStats.reduce((acc, curr) => acc + (curr.leads || 0) + (curr.form_submissions || 0), 0);
      
      case 'conversion_rate':
        const totalClicks = realStats.reduce((acc, curr) => acc + curr.clicks, 0);
        const totalConversions = realStats.reduce((acc, curr) => acc + curr.conversions, 0);
        return totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
      
      case 'cac':
        const totalLeads = realStats.reduce((acc, curr) => acc + (curr.leads || 0) + (curr.form_submissions || 0), 0);
        return totalLeads > 0 ? (totalSpend / totalLeads) : 0;
      
      case 'total_followers':
        return audienceData.reduce((acc, curr) => acc + (curr.size || 0), 0);
      
      case 'engagement_rate':
        const totalFollowers = audienceData.reduce((acc, curr) => acc + (curr.size || 0), 0);
        const totalEngagement = audienceData.reduce((acc, curr) => acc + (curr.engagement || 0), 0);
        return totalFollowers > 0 ? (totalEngagement / totalFollowers) * 100 : 0;
      
      case 'brand_reach':
        return audienceData.reduce((acc, curr) => acc + (curr.reach || 0), 0);
      
      case 'growth_rate':
        // This would need historical data - placeholder for now
        return 8.5; // Example growth rate
      
      case 'avg_order_value':
        const purchases = realStats.reduce((acc, curr) => acc + (curr.purchases || 0), 0);
        return purchases > 0 ? (totalRevenue / purchases) : 0;
      
      case 'purchase_frequency':
        // This would need customer-level data - placeholder
        return 1.2;
      
      case 'mql_count':
        return realStats.reduce((acc, curr) => acc + (curr.leads || 0), 0);
      
      default:
        return 0;
    }
  }

  // Check if metric meets threshold
  checkThreshold(metric, value) {
    const { threshold } = metric;
    
    switch (threshold.type) {
      case 'min':
        return value >= threshold.value;
      case 'max':
        return value <= threshold.value;
      case 'range':
        return value >= threshold.min && value <= threshold.max;
      default:
        return true;
    }
  }

  // Format metric value for display
  formatMetricValue(metric, value, formatCurrency, formatNumber) {
    switch (metric.type) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'ratio':
        return `${value.toFixed(2)}x`;
      case 'number':
      default:
        return formatNumber(value);
    }
  }
}

export default new MetricsService();
