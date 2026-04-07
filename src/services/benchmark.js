// Industry Benchmarking Service
// Compares member performance against top-tier Australian reptile industry baselines

class BenchmarkService {
  constructor() {
    // Industry baselines for top-tier Australian reptile organizations
    this.benchmarks = {
      social_media: {
        followers_growth_rate: 0.05, // 5% monthly growth
        engagement_rate: 0.04, // 4% average engagement
        post_frequency: 12, // posts per week
        video_completion_rate: 0.65, // 65% video completion
        story_completion_rate: 0.85 // 85% story completion
      },
      advertising: {
        roas_target: 4.5, // 4.5x return on ad spend
        ctr_target: 0.025, // 2.5% click-through rate
        cpc_max_aud: 2.50, // $2.50 max cost per click (Australia)
        conversion_rate_min: 0.03, // 3% minimum conversion rate
        frequency_optimal: 3.2 // optimal ad frequency
      },
      brand_metrics: {
        brand_search_volume: 1000, // monthly brand searches
        direct_traffic_percentage: 0.35, // 35% direct traffic
        repeat_customer_rate: 0.45, // 45% repeat customers
        customer_lifetime_value: 1250, // $1,250 CLV
        net_promoter_score: 65 // NPS score
      },
      content_quality: {
        visual_consistency_score: 0.85, // 85% visual consistency
        educational_content_ratio: 0.40, // 40% educational content
        community_engagement_rate: 0.12, // 12% community engagement
        expert_positioning_score: 0.78 // 78% expert positioning
      }
    };
  }

  // Compare member metrics against industry benchmarks
  comparePerformance(memberData) {
    const comparison = {};
    
    // Social Media Comparison
    comparison.social_media = this.compareSocialMedia(memberData.social_media || {});
    
    // Advertising Comparison
    comparison.advertising = this.compareAdvertising(memberData.advertising || {});
    
    // Brand Metrics Comparison
    comparison.brand_metrics = this.compareBrandMetrics(memberData.brand_metrics || {});
    
    // Content Quality Comparison
    comparison.content_quality = this.compareContentQuality(memberData.content_quality || {});
    
    // Overall Score
    comparison.overall_score = this.calculateOverallScore(comparison);
    comparison.grade = this.assignGrade(comparison.overall_score);
    
    return comparison;
  }

  compareSocialMedia(socialData) {
    const benchmarks = this.benchmarks.social_media;
    const comparison = {};

    // Followers Growth Rate
    if (socialData.followers_growth_rate !== undefined) {
      comparison.followers_growth = {
        member: socialData.followers_growth_rate,
        benchmark: benchmarks.followers_growth_rate,
        performance: this.getPerformanceLevel(socialData.followers_growth_rate, benchmarks.followers_growth_rate),
        gap: socialData.followers_growth_rate - benchmarks.followers_growth_rate
      };
    }

    // Engagement Rate
    if (socialData.engagement_rate !== undefined) {
      comparison.engagement = {
        member: socialData.engagement_rate,
        benchmark: benchmarks.engagement_rate,
        performance: this.getPerformanceLevel(socialData.engagement_rate, benchmarks.engagement_rate),
        gap: socialData.engagement_rate - benchmarks.engagement_rate
      };
    }

    // Post Frequency
    if (socialData.posts_per_week !== undefined) {
      comparison.frequency = {
        member: socialData.posts_per_week,
        benchmark: benchmarks.post_frequency,
        performance: this.getPerformanceLevel(socialData.posts_per_week, benchmarks.post_frequency),
        gap: socialData.posts_per_week - benchmarks.post_frequency
      };
    }

    return comparison;
  }

  compareAdvertising(adData) {
    const benchmarks = this.benchmarks.advertising;
    const comparison = {};

    // ROAS
    if (adData.roas !== undefined) {
      comparison.roas = {
        member: adData.roas,
        benchmark: benchmarks.roas_target,
        performance: this.getPerformanceLevel(adData.roas, benchmarks.roas_target),
        gap: adData.roas - benchmarks.roas_target
      };
    }

    // Click-Through Rate
    if (adData.ctr !== undefined) {
      comparison.ctr = {
        member: adData.ctr,
        benchmark: benchmarks.ctr_target,
        performance: this.getPerformanceLevel(adData.ctr, benchmarks.ctr_target),
        gap: adData.ctr - benchmarks.ctr_target
      };
    }

    // Cost Per Click
    if (adData.cpc !== undefined) {
      comparison.cpc = {
        member: adData.cpc,
        benchmark: benchmarks.cpc_max_aud,
        performance: this.getPerformanceLevel(benchmarks.cpc_max_aud, adData.cpc), // Lower is better
        gap: benchmarks.cpc_max_aud - adData.cpc
      };
    }

    // Conversion Rate
    if (adData.conversion_rate !== undefined) {
      comparison.conversion_rate = {
        member: adData.conversion_rate,
        benchmark: benchmarks.conversion_rate_min,
        performance: this.getPerformanceLevel(adData.conversion_rate, benchmarks.conversion_rate_min),
        gap: adData.conversion_rate - benchmarks.conversion_rate_min
      };
    }

    return comparison;
  }

  compareBrandMetrics(brandData) {
    const benchmarks = this.benchmarks.brand_metrics;
    const comparison = {};

    // Brand Search Volume
    if (brandData.brand_searches !== undefined) {
      comparison.search_volume = {
        member: brandData.brand_searches,
        benchmark: benchmarks.brand_search_volume,
        performance: this.getPerformanceLevel(brandData.brand_searches, benchmarks.brand_search_volume),
        gap: brandData.brand_searches - benchmarks.brand_search_volume
      };
    }

    // Direct Traffic Percentage
    if (brandData.direct_traffic_percentage !== undefined) {
      comparison.direct_traffic = {
        member: brandData.direct_traffic_percentage,
        benchmark: benchmarks.direct_traffic_percentage,
        performance: this.getPerformanceLevel(brandData.direct_traffic_percentage, benchmarks.direct_traffic_percentage),
        gap: brandData.direct_traffic_percentage - benchmarks.direct_traffic_percentage
      };
    }

    // Repeat Customer Rate
    if (brandData.repeat_customer_rate !== undefined) {
      comparison.repeat_customers = {
        member: brandData.repeat_customer_rate,
        benchmark: benchmarks.repeat_customer_rate,
        performance: this.getPerformanceLevel(brandData.repeat_customer_rate, benchmarks.repeat_customer_rate),
        gap: brandData.repeat_customer_rate - benchmarks.repeat_customer_rate
      };
    }

    return comparison;
  }

  compareContentQuality(contentData) {
    const benchmarks = this.benchmarks.content_quality;
    const comparison = {};

    // Visual Consistency
    if (contentData.visual_consistency !== undefined) {
      comparison.visual_consistency = {
        member: contentData.visual_consistency,
        benchmark: benchmarks.visual_consistency_score,
        performance: this.getPerformanceLevel(contentData.visual_consistency, benchmarks.visual_consistency_score),
        gap: contentData.visual_consistency - benchmarks.visual_consistency_score
      };
    }

    // Educational Content Ratio
    if (contentData.educational_ratio !== undefined) {
      comparison.educational_content = {
        member: contentData.educational_ratio,
        benchmark: benchmarks.educational_content_ratio,
        performance: this.getPerformanceLevel(contentData.educational_ratio, benchmarks.educational_content_ratio),
        gap: contentData.educational_ratio - benchmarks.educational_content_ratio
      };
    }

    // Expert Positioning
    if (contentData.expert_positioning !== undefined) {
      comparison.expert_positioning = {
        member: contentData.expert_positioning,
        benchmark: benchmarks.expert_positioning_score,
        performance: this.getPerformanceLevel(contentData.expert_positioning, benchmarks.expert_positioning_score),
        gap: contentData.expert_positioning - benchmarks.expert_positioning_score
      };
    }

    return comparison;
  }

  // Determine performance level relative to benchmark
  getPerformanceLevel(memberValue, benchmarkValue, lowerIsBetter = false) {
    const ratio = lowerIsBetter ? benchmarkValue / memberValue : memberValue / benchmarkValue;
    
    if (ratio >= 1.2) return 'excellent';
    if (ratio >= 1.0) return 'above_benchmark';
    if (ratio >= 0.8) return 'approaching_benchmark';
    if (ratio >= 0.6) return 'below_benchmark';
    return 'critical';
  }

  // Calculate overall performance score
  calculateOverallScore(comparison) {
    let totalScore = 0;
    let metricCount = 0;

    const scoreMapping = {
      'excellent': 100,
      'above_benchmark': 85,
      'approaching_benchmark': 70,
      'below_benchmark': 50,
      'critical': 25
    };

    // Score each metric
    Object.values(comparison).forEach(category => {
      Object.values(category).forEach(metric => {
        if (metric.performance) {
          totalScore += scoreMapping[metric.performance] || 0;
          metricCount++;
        }
      });
    });

    return metricCount > 0 ? Math.round(totalScore / metricCount) : 0;
  }

  // Assign overall grade
  assignGrade(score) {
    if (score >= 90) return { grade: 'A+', description: 'Elite Performance' };
    if (score >= 80) return { grade: 'A', description: 'Industry Leader' };
    if (score >= 70) return { grade: 'B+', description: 'Strong Performer' };
    if (score >= 60) return { grade: 'B', description: 'Competitive' };
    if (score >= 50) return { grade: 'C+', description: 'Developing' };
    if (score >= 40) return { grade: 'C', description: 'Needs Improvement' };
    return { grade: 'D', description: 'Critical Attention Required' };
  }

  // Generate actionable recommendations
  generateRecommendations(comparison) {
    const recommendations = [];

    // Social Media Recommendations
    if (comparison.social_media) {
      if (comparison.social_media.engagement?.performance === 'below_benchmark' || 
          comparison.social_media.engagement?.performance === 'critical') {
        recommendations.push({
          category: 'Social Media',
          priority: 'high',
          title: 'Boost Engagement Strategy',
          description: 'Your engagement rate is below industry standards. Focus on creating more interactive content, responding to comments promptly, and leveraging user-generated content.',
          expected_impact: '+15-25% engagement improvement'
        });
      }

      if (comparison.social_media.frequency?.performance === 'below_benchmark') {
        recommendations.push({
          category: 'Content Strategy',
          priority: 'medium',
          title: 'Increase Posting Frequency',
          description: 'Top performers post consistently. Develop a content calendar to maintain regular posting schedule.',
          expected_impact: '+20% reach and visibility'
        });
      }
    }

    // Advertising Recommendations
    if (comparison.advertising) {
      if (comparison.advertising.roas?.performance === 'below_benchmark' || 
          comparison.advertising.roas?.performance === 'critical') {
        recommendations.push({
          category: 'Advertising',
          priority: 'high',
          title: 'Optimize Ad Performance',
          description: 'Your ROAS needs improvement. Review targeting, ad creative, and landing page experience to increase conversion rates.',
          expected_impact: '+30-50% ROAS improvement'
        });
      }

      if (comparison.advertising.ctr?.performance === 'below_benchmark') {
        recommendations.push({
          category: 'Ad Creative',
          priority: 'medium',
          title: 'Improve Ad Creative',
          description: 'Test different ad formats, headlines, and visuals to improve click-through rates.',
          expected_impact: '+40% CTR improvement'
        });
      }
    }

    // Brand Recommendations
    if (comparison.brand_metrics) {
      if (comparison.brand_metrics.direct_traffic?.performance === 'below_benchmark') {
        recommendations.push({
          category: 'Brand Building',
          priority: 'medium',
          title: 'Strengthen Brand Recognition',
          description: 'Increase brand visibility through consistent messaging, community involvement, and educational content.',
          expected_impact: '+25% direct traffic'
        });
      }
    }

    return recommendations.slice(0, 5); // Return top 5 recommendations
  }
}

export const benchmarkService = new BenchmarkService();
