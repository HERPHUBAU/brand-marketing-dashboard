// Brand Audit Service
// Analyzes brand identity, positioning, and market alignment

class BrandAuditService {
  constructor() {
    this.auditCriteria = {
      visual_identity: {
        logo_quality: { weight: 0.25, max_score: 100 },
        color_consistency: { weight: 0.20, max_score: 100 },
        typography: { weight: 0.15, max_score: 100 },
        visual_cohesion: { weight: 0.20, max_score: 100 },
        professional_appearance: { weight: 0.20, max_score: 100 }
      },
      business_identity: {
        name_clarity: { weight: 0.30, max_score: 100 },
        memorability: { weight: 0.25, max_score: 100 },
        professional_domain: { weight: 0.20, max_score: 100 },
        niche_alignment: { weight: 0.25, max_score: 100 }
      },
      market_positioning: {
        expertise_signaling: { weight: 0.30, max_score: 100 },
        niche_focus: { weight: 0.25, max_score: 100 },
        value_proposition: { weight: 0.25, max_score: 100 },
        competitive_differentiation: { weight: 0.20, max_score: 100 }
      },
      trust_authority: {
        credibility_indicators: { weight: 0.35, max_score: 100 },
        social_proof: { weight: 0.25, max_score: 100 },
        professional_standards: { weight: 0.25, max_score: 100 },
        community_engagement: { weight: 0.15, max_score: 100 }
      }
    };
  }

  // Conduct comprehensive brand audit
  async conductAudit(brandData, socialData, websiteData = {}) {
    const audit = {
      timestamp: new Date().toISOString(),
      overall_score: 0,
      categories: {},
      recommendations: [],
      strengths: [],
      improvements: []
    };

    // Visual Identity Assessment
    audit.categories.visual_identity = this.assessVisualIdentity(brandData);
    
    // Business Identity Assessment
    audit.categories.business_identity = this.assessBusinessIdentity(brandData);
    
    // Market Positioning Assessment
    audit.categories.market_positioning = this.assessMarketPositioning(brandData, socialData);
    
    // Trust & Authority Assessment
    audit.categories.trust_authority = this.assessTrustAuthority(brandData, socialData, websiteData);
    
    // Calculate overall score
    audit.overall_score = this.calculateOverallScore(audit.categories);
    
    // Generate insights and recommendations
    audit.recommendations = this.generateRecommendations(audit.categories);
    audit.strengths = this.identifyStrengths(audit.categories);
    audit.improvements = this.identifyImprovements(audit.categories);
    
    // Assign grades
    audit.grade = this.assignGrade(audit.overall_score);
    
    return audit;
  }

  assessVisualIdentity(brandData) {
    const scores = {};
    const criteria = this.auditCriteria.visual_identity;

    // Logo Quality Assessment
    scores.logo_quality = this.assessLogoQuality(brandData.logo);
    
    // Color Consistency
    scores.color_consistency = this.assessColorConsistency(brandData.colors);
    
    // Typography
    scores.typography = this.assessTypography(brandData.typography);
    
    // Visual Cohesion
    scores.visual_cohesion = this.assessVisualCohesion(brandData);
    
    // Professional Appearance
    scores.professional_appearance = this.assessProfessionalAppearance(brandData);

    // Calculate weighted score
    const weightedScore = this.calculateWeightedScore(scores, criteria);
    
    return {
      scores,
      weighted_score: weightedScore,
      grade: this.assignGrade(weightedScore),
      insights: this.generateVisualIdentityInsights(scores)
    };
  }

  assessBusinessIdentity(brandData) {
    const scores = {};
    const criteria = this.auditCriteria.business_identity;

    // Name Clarity
    scores.name_clarity = this.assessNameClarity(brandData.business_name);
    
    // Memorability
    scores.memorability = this.assessMemorability(brandData.business_name, brandData.tagline);
    
    // Professional Domain
    scores.professional_domain = this.assessProfessionalDomain(brandData.website);
    
    // Niche Alignment
    scores.niche_alignment = this.assessNicheAlignment(brandData.description, brandData.services);

    const weightedScore = this.calculateWeightedScore(scores, criteria);
    
    return {
      scores,
      weighted_score: weightedScore,
      grade: this.assignGrade(weightedScore),
      insights: this.generateBusinessIdentityInsights(scores)
    };
  }

  assessMarketPositioning(brandData, socialData) {
    const scores = {};
    const criteria = this.auditCriteria.market_positioning;

    // Expertise Signaling
    scores.expertise_signaling = this.assessExpertiseSignaling(brandData.description, socialData);
    
    // Niche Focus
    scores.niche_focus = this.assessNicheFocus(brandData.services, brandData.target_audience);
    
    // Value Proposition
    scores.value_proposition = this.assessValueProposition(brandData.value_proposition, brandData.unique_selling_points);
    
    // Competitive Differentiation
    scores.competitive_differentiation = this.assessCompetitiveDifferentiation(brandData);

    const weightedScore = this.calculateWeightedScore(scores, criteria);
    
    return {
      scores,
      weighted_score: weightedScore,
      grade: this.assignGrade(weightedScore),
      insights: this.generateMarketPositioningInsights(scores)
    };
  }

  assessTrustAuthority(brandData, socialData, websiteData) {
    const scores = {};
    const criteria = this.auditCriteria.trust_authority;

    // Credibility Indicators
    scores.credibility_indicators = this.assessCredibilityIndicators(brandData, websiteData);
    
    // Social Proof
    scores.social_proof = this.assessSocialProof(socialData);
    
    // Professional Standards
    scores.professional_standards = this.assessProfessionalStandards(brandData);
    
    // Community Engagement
    scores.community_engagement = this.assessCommunityEngagement(socialData);

    const weightedScore = this.calculateWeightedScore(scores, criteria);
    
    return {
      scores,
      weighted_score: weightedScore,
      grade: this.assignGrade(weightedScore),
      insights: this.generateTrustAuthorityInsights(scores)
    };
  }

  // Individual assessment methods
  assessLogoQuality(logoData) {
    if (!logoData) return 30;
    
    let score = 50; // Base score
    
    // Check for professional logo characteristics
    if (logoData.has_high_resolution) score += 15;
    if (logoData.is_scalable) score += 10;
    if (logoData.good_contrast) score += 10;
    if (logoData.appropriate_complexity) score += 10;
    if (logoData.memorable_design) score += 5;
    
    return Math.min(score, 100);
  }

  assessColorConsistency(colorData) {
    if (!colorData || !colorData.primary_colors) return 40;
    
    let score = 60; // Base score
    
    // Check color palette characteristics
    if (colorData.primary_colors.length >= 2 && colorData.primary_colors.length <= 4) score += 15;
    if (colorData.has_brand_guidelines) score += 15;
    if (colorData.consistent_usage) score += 10;
    
    return Math.min(score, 100);
  }

  assessTypography(typographyData) {
    if (!typographyData) return 50;
    
    let score = 60;
    
    if (typographyData.consistent_fonts) score += 20;
    if (typographyData.readable_hierarchy) score += 10;
    if (typographyData.professional_font_choice) score += 10;
    
    return Math.min(score, 100);
  }

  assessVisualCohesion(brandData) {
    let score = 50;
    
    if (brandData.consistent_style) score += 20;
    if (brandData.cohesive_imagery) score += 15;
    if (brandData.unified_aesthetic) score += 15;
    
    return Math.min(score, 100);
  }

  assessProfessionalAppearance(brandData) {
    let score = 50;
    
    if (brandData.professional_design) score += 20;
    if (brandData.quality_materials) score += 15;
    if (brandData.attention_to_detail) score += 15;
    
    return Math.min(score, 100);
  }

  assessNameClarity(businessName) {
    if (!businessName) return 20;
    
    let score = 50;
    
    // Check name characteristics
    if (businessName.length >= 3 && businessName.length <= 25) score += 15;
    if (!businessName.includes('and') && !businessName.includes('&')) score += 10;
    if (this.isEasyToPronounce(businessName)) score += 10;
    if (this.isRelevantToNiche(businessName)) score += 15;
    
    return Math.min(score, 100);
  }

  assessMemorability(businessName, tagline) {
    let score = 50;
    
    if (businessName && this.isUnique(businessName)) score += 20;
    if (tagline && tagline.length > 0) score += 15;
    if (this.hasBrandStory(businessName, tagline)) score += 15;
    
    return Math.min(score, 100);
  }

  assessProfessionalDomain(website) {
    if (!website) return 30;
    
    let score = 50;
    
    if (website.includes('.com.au') || website.includes('.au')) score += 25;
    if (!website.includes('wix') && !website.includes('wordpress.com')) score += 15;
    if (website.length <= 20) score += 10;
    
    return Math.min(score, 100);
  }

  assessNicheAlignment(description, services) {
    let score = 50;
    
    if (description && this.containsReptileKeywords(description)) score += 25;
    if (services && this.containsReptileKeywords(services)) score += 25;
    
    return Math.min(score, 100);
  }

  assessExpertiseSignaling(description, socialData) {
    let score = 50;
    
    if (description && this.showsExpertise(description)) score += 25;
    if (socialData && socialData.educational_content_ratio > 0.3) score += 15;
    if (socialData && socialData.expert_positioning_score > 0.7) score += 10;
    
    return Math.min(score, 100);
  }

  assessNicheFocus(services, targetAudience) {
    let score = 50;
    
    if (services && this.isFocused(services)) score += 25;
    if (targetAudience && this.isSpecificAudience(targetAudience)) score += 25;
    
    return Math.min(score, 100);
  }

  assessValueProposition(valueProp, uniqueSellingPoints) {
    let score = 50;
    
    if (valueProp && valueProp.length > 0) score += 25;
    if (uniqueSellingPoints && uniqueSellingPoints.length > 0) score += 25;
    
    return Math.min(score, 100);
  }

  assessCompetitiveDifferentiation(brandData) {
    let score = 50;
    
    if (brandData.unique_selling_points && brandData.unique_selling_points.length > 0) score += 25;
    if (brandData.competitive_advantages) score += 25;
    
    return Math.min(score, 100);
  }

  assessCredibilityIndicators(brandData, websiteData) {
    let score = 50;
    
    if (brandData.licenses_certifications) score += 20;
    if (websiteData && websiteData.ssl_certificate) score += 15;
    if (brandData.professional_associations) score += 15;
    
    return Math.min(score, 100);
  }

  assessSocialProof(socialData) {
    if (!socialData) return 30;
    
    let score = 50;
    
    if (socialData.follower_count > 1000) score += 20;
    if (socialData.testimonials_count > 10) score += 15;
    if (socialData.engagement_rate > 0.03) score += 15;
    
    return Math.min(score, 100);
  }

  assessProfessionalStandards(brandData) {
    let score = 50;
    
    if (brandData.compliance_certifications) score += 25;
    if (brandData.industry_standards) score += 25;
    
    return Math.min(score, 100);
  }

  assessCommunityEngagement(socialData) {
    if (!socialData) return 30;
    
    let score = 50;
    
    if (socialData.community_involvement) score += 25;
    if (socialData.engagement_rate > 0.04) score += 25;
    
    return Math.min(score, 100);
  }

  // Helper methods
  isEasyToPronounce(name) {
    // Simple heuristic - avoid complex consonant clusters
    return !/[bcdfghjklmnpqrstvwxyz]{4,}/i.test(name);
  }

  isRelevantToNiche(text) {
    const reptileKeywords = ['reptile', 'herp', 'snake', 'lizard', 'turtle', 'gecko', 'python', 'dragon'];
    return reptileKeywords.some(keyword => text.toLowerCase().includes(keyword));
  }

  containsReptileKeywords(text) {
    return this.isRelevantToNiche(text);
  }

  isUnique(name) {
    // Simple uniqueness check - would need database lookup in production
    return name.length > 3;
  }

  hasBrandStory(name, tagline) {
    return tagline && tagline.length > 10;
  }

  showsExpertise(text) {
    const expertiseWords = ['expert', 'specialist', 'professional', 'certified', 'experienced', 'qualified'];
    return expertiseWords.some(word => text.toLowerCase().includes(word));
  }

  isFocused(services) {
    // Check if services are focused rather than too broad
    return services && services.length > 0 && services.length < 10;
  }

  isSpecificAudience(audience) {
    return audience && audience.length > 0;
  }

  calculateWeightedScore(scores, criteria) {
    let totalScore = 0;
    let totalWeight = 0;

    Object.keys(scores).forEach(key => {
      if (criteria[key]) {
        totalScore += scores[key] * criteria[key].weight;
        totalWeight += criteria[key].weight;
      }
    });

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }

  calculateOverallScore(categories) {
    let totalScore = 0;
    let categoryCount = 0;

    Object.values(categories).forEach(category => {
      if (category.weighted_score) {
        totalScore += category.weighted_score;
        categoryCount++;
      }
    });

    return categoryCount > 0 ? Math.round(totalScore / categoryCount) : 0;
  }

  assignGrade(score) {
    if (score >= 90) return { grade: 'A+', description: 'Exceptional' };
    if (score >= 80) return { grade: 'A', description: 'Excellent' };
    if (score >= 70) return { grade: 'B', description: 'Good' };
    if (score >= 60) return { grade: 'C', description: 'Satisfactory' };
    if (score >= 50) return { grade: 'D', description: 'Needs Work' };
    return { grade: 'F', description: 'Critical Issues' };
  }

  generateRecommendations(categories) {
    const recommendations = [];

    // Analyze each category for improvement opportunities
    Object.entries(categories).forEach(([categoryName, category]) => {
      Object.entries(category.scores).forEach(([metricName, score]) => {
        if (score < 70) {
          recommendations.push(this.getRecommendationForMetric(categoryName, metricName));
        }
      });
    });

    return recommendations.slice(0, 6); // Return top 6 recommendations
  }

  getRecommendationForMetric(category, metricName) {
    const recommendations = {
      visual_identity: {
        logo_quality: {
          title: 'Upgrade Logo Design',
          description: 'Invest in a professional logo that is scalable, high-resolution, and memorable.',
          priority: 'high',
          expected_impact: '+25% brand recognition'
        },
        color_consistency: {
          title: 'Establish Brand Color Guidelines',
          description: 'Create a consistent color palette and apply it across all touchpoints.',
          priority: 'medium',
          expected_impact: '+20% brand cohesion'
        }
      },
      business_identity: {
        name_clarity: {
          title: 'Refine Business Name',
          description: 'Consider a name that is clear, memorable, and relevant to the reptile industry.',
          priority: 'high',
          expected_impact: '+30% brand recall'
        }
      },
      market_positioning: {
        expertise_signaling: {
          title: 'Demonstrate Expertise',
          description: 'Showcase your knowledge through educational content and certifications.',
          priority: 'high',
          expected_impact: '+35% trust signals'
        }
      }
    };

    return recommendations[category]?.[metricName] || {
      title: 'Improve Brand Element',
      description: 'Focus on strengthening this aspect of your brand identity.',
      priority: 'medium',
      expected_impact: '+15% overall score'
    };
  }

  identifyStrengths(categories) {
    const strengths = [];

    Object.entries(categories).forEach(([categoryName, category]) => {
      Object.entries(category.scores).forEach(([metricName, score]) => {
        if (score >= 85) {
          strengths.push({
            category: categoryName,
            metric: metricName,
            score: score,
            description: this.getStrengthDescription(categoryName, metricName)
          });
        }
      });
    });

    return strengths;
  }

  identifyImprovements(categories) {
    const improvements = [];

    Object.entries(categories).forEach(([categoryName, category]) => {
      Object.entries(category.scores).forEach(([metricName, score]) => {
        if (score < 60) {
          improvements.push({
            category: categoryName,
            metric: metricName,
            score: score,
            description: this.getImprovementDescription(categoryName, metricName)
          });
        }
      });
    });

    return improvements.sort((a, b) => a.score - b.score).slice(0, 3);
  }

  getStrengthDescription(category, metricName) {
    const descriptions = {
      visual_identity: {
        logo_quality: 'Professional and memorable logo design',
        color_consistency: 'Strong and consistent brand colors',
        typography: 'Effective font choices and hierarchy'
      },
      business_identity: {
        name_clarity: 'Clear and memorable business name',
        professional_domain: 'Professional web presence'
      }
    };

    return descriptions[category]?.[metricName] || 'Strong performance in this area';
  }

  getImprovementDescription(category, metricName) {
    const descriptions = {
      visual_identity: {
        logo_quality: 'Logo needs professional redesign',
        color_consistency: 'Inconsistent color usage across platforms'
      },
      business_identity: {
        name_clarity: 'Business name could be clearer or more memorable',
        professional_domain: 'Upgrade to professional domain name'
      }
    };

    return descriptions[category]?.[metricName] || 'Needs attention and improvement';
  }

  generateVisualIdentityInsights(scores) {
    const insights = [];
    
    if (scores.logo_quality < 60) {
      insights.push('Logo design significantly impacts first impressions and brand recall');
    }
    
    if (scores.color_consistency < 70) {
      insights.push('Color consistency builds brand recognition across all touchpoints');
    }
    
    return insights;
  }

  generateBusinessIdentityInsights(scores) {
    const insights = [];
    
    if (scores.name_clarity < 60) {
      insights.push('A clear business name is crucial for word-of-mouth referrals');
    }
    
    if (scores.professional_domain < 70) {
      insights.push('Professional domain names build credibility and trust');
    }
    
    return insights;
  }

  generateMarketPositioningInsights(scores) {
    const insights = [];
    
    if (scores.expertise_signaling < 70) {
      insights.push('Demonstrating expertise is essential in the specialized reptile industry');
    }
    
    return insights;
  }

  generateTrustAuthorityInsights(scores) {
    const insights = [];
    
    if (scores.credibility_indicators < 70) {
      insights.push('Trust indicators are critical for high-value reptile transactions');
    }
    
    return insights;
  }
}

export const brandAuditService = new BrandAuditService();
