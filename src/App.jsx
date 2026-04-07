import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Megaphone, BarChart3, Users, Calendar, Search,
  Layers, ImageIcon, Wallet, ShieldCheck, TrendingUp, CheckCircle2, X,
  Target, Zap, Compass, Lightbulb, Download, AlertCircle, Award, Eye,
  MousePointer, DollarSign, Activity, TrendingDown, UserCheck,
  FileText, Settings, Lock, Unlock, RefreshCw
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, LineChart, Line,
  ComposedChart, Legend
} from 'recharts';

// Import services
import { authService } from './services/auth.js';
import { metaService } from './services/meta.js';
import { benchmarkService } from './services/benchmark.js';
import { brandAuditService } from './services/brandAudit.js';

// --- HELPERS: BIG TECH MINIMALISM ---
const formatCurrency = (val) => new Intl.NumberFormat('en-AU', { 
  style: 'currency', 
  currency: 'AUD', 
  maximumFractionDigits: 0 
}).format(val || 0);

const formatNumber = (val) => new Intl.NumberFormat('en-AU', { 
  maximumFractionDigits: 0 
}).format(val || 0);

// --- MODULE COMPONENTS ---
const CampaignModule = ({ campaignData, formatCurrency, formatNumber }) => {
  if (!campaignData || campaignData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 opacity-20">
        <Megaphone size={48} className="mb-4" />
        <p className="uppercase tracking-[0.3em] text-[10px] font-black">No Campaign Data Available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {campaignData.slice(0, 3).map((campaign, index) => (
          <div key={index} className="bg-[#33302E] border border-[#45413E] p-6">
            <h4 className="text-[#D2B48C] text-[10px] uppercase font-black tracking-widest mb-2">{campaign.name || `Campaign ${index + 1}`}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[10px] text-[#D8D3CC]">Spend:</span>
                <span className="text-[10px] font-bold text-[#D8D3CC]">{formatCurrency(campaign.spend || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-[#D8D3CC]">Results:</span>
                <span className="text-[10px] font-bold text-[#D8D3CC]">{formatNumber(campaign.results || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-[#D8D3CC]">ROAS:</span>
                <span className="text-[10px] font-bold text-[#D8D3CC]">{(campaign.roas || 0).toFixed(2)}x</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CreativeModule = ({ creativeData }) => {
  if (!creativeData || creativeData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 opacity-20">
        <ImageIcon size={48} className="mb-4" />
        <p className="uppercase tracking-[0.3em] text-[10px] font-black">No Creative Data Available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creativeData.slice(0, 6).map((creative, index) => (
        <div key={index} className="bg-[#33302E] border border-[#45413E] p-4">
          <div className="aspect-video bg-[#45413E] rounded mb-4 flex items-center justify-center">
            <ImageIcon size={24} className="text-[#D2B48C]" />
          </div>
          <h4 className="text-[#D2B48C] text-[10px] uppercase font-black tracking-widest mb-2 truncate">{creative.name || `Creative ${index + 1}`}</h4>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <span className="text-[#D2B48C]">Impressions:</span>
              <div className="font-bold text-[#D8D3CC]">{formatNumber(creative.impressions || 0)}</div>
            </div>
            <div>
              <span className="text-[#D2B48C]">CTR:</span>
              <div className="font-bold text-[#D8D3CC]">{((creative.ctr || 0) * 100).toFixed(2)}%</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AudienceModule = ({ audienceData }) => {
  if (!audienceData || audienceData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 opacity-20">
        <Users size={48} className="mb-4" />
        <p className="uppercase tracking-[0.3em] text-[10px] font-black">No Audience Data Available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[400px] bg-[#33302E] p-8 border border-[#45413E]">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D2B48C] mb-8">Age Demographics</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={[
              { age: '18-24', value: 15 },
              { age: '25-34', value: 35 },
              { age: '35-44', value: 28 },
              { age: '45-54', value: 17 },
              { age: '55+', value: 5 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#45413E" vertical={false} />
              <XAxis dataKey="age" tick={{ fill: '#D2B48C', fontSize: 10 }} />
              <YAxis tick={{ fill: '#D2B48C', fontSize: 10 }} />
              <Tooltip contentStyle={{backgroundColor: '#1A1817', border: 'none', color: '#D8D3CC'}} />
              <Bar dataKey="value" fill="#A84323" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="h-[400px] bg-[#33302E] p-8 border border-[#45413E]">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D2B48C] mb-8">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Male', value: 65, color: '#A84323' },
                  { name: 'Female', value: 30, color: '#D2B48C' },
                  { name: 'Other', value: 5, color: '#45413E' }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {[
                  { name: 'Male', value: 65, color: '#A84323' },
                  { name: 'Female', value: 30, color: '#D2B48C' },
                  { name: 'Other', value: 5, color: '#45413E' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{backgroundColor: '#1A1817', border: 'none', color: '#D8D3CC'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const BudgetModule = ({ realStats, formatCurrency }) => {
  const totalBudget = realStats.reduce((acc, curr) => acc + curr.spend, 0);
  const avgDailySpend = totalBudget / 30; // Assuming 30-day period

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#33302E] border border-[#45413E] p-6">
          <h3 className="text-[#D2B48C] text-[10px] uppercase font-black tracking-widest mb-4">Total Budget</h3>
          <div className="text-2xl font-bold text-[#D8D3CC] mb-2">{formatCurrency(totalBudget)}</div>
          <div className="text-[10px] text-[#A84323]">Current period</div>
        </div>
        
        <div className="bg-[#33302E] border border-[#45413E] p-6">
          <h3 className="text-[#D2B48C] text-[10px] uppercase font-black tracking-widest mb-4">Daily Average</h3>
          <div className="text-2xl font-bold text-[#D8D3CC] mb-2">{formatCurrency(avgDailySpend)}</div>
          <div className="text-[10px] text-[#A84323]">Per day</div>
        </div>
        
        <div className="bg-[#33302E] border border-[#45413E] p-6">
          <h3 className="text-[#D2B48C] text-[10px] uppercase font-black tracking-widest mb-4">Budget Utilization</h3>
          <div className="text-2xl font-bold text-[#D8D3CC] mb-2">78%</div>
          <div className="w-full bg-[#45413E] h-2 rounded-full">
            <div className="bg-[#A84323] h-2 rounded-full" style={{width: '78%'}}></div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#33302E] border border-[#45413E] p-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D2B48C] mb-6">Budget Recommendations</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="text-[#A84323] mt-1" size={16} />
            <div>
              <h4 className="text-[#D8D3CC] text-sm font-bold mb-1">Increase Budget by 20%</h4>
              <p className="text-[#D8D3CC] text-xs opacity-70">Your current ROAS indicates room for scaling. Consider increasing budget to capture additional demand.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Target className="text-[#A84323] mt-1" size={16} />
            <div>
              <h4 className="text-[#D8D3CC] text-sm font-bold mb-1">Focus on High-Performing Creatives</h4>
              <p className="text-[#D8D3CC] text-xs opacity-70">Reallocate 60% of budget to top 3 performing creatives for maximum efficiency.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InsightsModule = ({ benchmarkData, brandAuditData, dateRange, setDateRange }) => {
  return (
    <div className="space-y-6">
      {brandAuditData && (
        <div className="bg-[#33302E] border border-[#45413E] p-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D2B48C] mb-6">Brand Audit Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D8D3CC] mb-2">{brandAuditData.categories.visual_identity?.weighted_score || 0}</div>
              <div className="text-[10px] uppercase tracking-widest text-[#D2B48C]">Visual Identity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D8D3CC] mb-2">{brandAuditData.categories.business_identity?.weighted_score || 0}</div>
              <div className="text-[10px] uppercase tracking-widest text-[#D2B48C]">Business Identity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D8D3CC] mb-2">{brandAuditData.categories.market_positioning?.weighted_score || 0}</div>
              <div className="text-[10px] uppercase tracking-widest text-[#D2B48C]">Market Positioning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D8D3CC] mb-2">{brandAuditData.categories.trust_authority?.weighted_score || 0}</div>
              <div className="text-[10px] uppercase tracking-widest text-[#D2B48C]">Trust & Authority</div>
            </div>
          </div>
          
          {brandAuditData.recommendations && brandAuditData.recommendations.length > 0 && (
            <div>
              <h4 className="text-[#D2B48C] text-sm font-bold mb-4">Top Recommendations</h4>
              <div className="space-y-3">
                {brandAuditData.recommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className="bg-[#1A1817] p-4 rounded border border-[#45413E]">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="text-[#A84323] mt-1" size={16} />
                      <div className="flex-1">
                        <h5 className="text-[#D8D3CC] text-sm font-bold mb-1">{rec.title}</h5>
                        <p className="text-[#D8D3CC] text-xs opacity-70 mb-2">{rec.description}</p>
                        <span className="text-[10px] text-[#A84323] font-bold">{rec.expected_impact}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {benchmarkData && (
        <div className="bg-[#33302E] border border-[#45413E] p-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D2B48C] mb-6">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[#D2B48C] text-sm font-bold mb-3">Strengths</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-400" size={16} />
                  <span className="text-[#D8D3CC] text-xs">Strong ROAS performance vs industry</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-400" size={16} />
                  <span className="text-[#D8D3CC] text-xs">Efficient cost per acquisition</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[#D2B48C] text-sm font-bold mb-3">Improvement Areas</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-yellow-400" size={16} />
                  <span className="text-[#D8D3CC] text-xs">Below average engagement rate</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDateRange('last_7d')}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-200 ${
                    dateRange === 'last_7d' 
                      ? 'bg-[#A84323] text-white' 
                      : 'bg-[#45413E] text-[#D8D3CC] hover:bg-[#5A524F]'
                  }`}
                >
                  7d
                </button>
                <button
                  onClick={() => setDateRange('last_28d')}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-200 ${
                    dateRange === 'last_28d' 
                      ? 'bg-[#A84323] text-white' 
                      : 'bg-[#45413E] text-[#D8D3CC] hover:bg-[#5A524F]'
                  }`}
                >
                  28d
                </button>
                <button
                  onClick={() => setDateRange('last_90d')}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-200 ${
                    dateRange === 'last_90d' 
                      ? 'bg-[#A84323] text-white' 
                      : 'bg-[#45413E] text-[#D8D3CC] hover:bg-[#5A524F]'
                  }`}
                >
                  90d
                </button>
                <button
                  onClick={() => setDateRange('maximum')}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-200 ${
                    dateRange === 'maximum' 
                      ? 'bg-[#A84323] text-white' 
                      : 'bg-[#45413E] text-[#D8D3CC] hover:bg-[#5A524F]'
                  }`}
                >
                  Lifetime
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AuthGuard = ({ children, isAuthenticated, loading, error, onConnectMeta }) => {
  if (loading) {
    return (
      <div className="flex h-screen bg-[#1A1817] text-[#D8D3CC] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
          <p className="uppercase tracking-[0.3em] text-[10px] font-black">Verifying Access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-[#1A1817] text-[#D8D3CC] items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <Lock className="mx-auto mb-6 text-[#A84323]" size={64} />
          <h1 className="text-2xl font-black mb-4">Access Restricted</h1>
          <p className="text-sm mb-8 opacity-70">{error || 'This dashboard is exclusive to HERP HUB AU "The Collective" members.'}</p>
          <button 
            onClick={onConnectMeta}
            className="bg-[#A84323] text-white text-[10px] font-black uppercase px-8 py-3.5 tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all mb-4"
          >
            Connect Meta Account
          </button>
          <p className="text-[10px] opacity-50">Requires "The Collective" membership</p>
        </div>
      </div>
    );
  }

  return children;
};

const AUDIENCE_DATA = [
  { subject: 'Reptile Owners', A: 120, fullMark: 150 },
  { subject: 'Breeders', A: 98, fullMark: 150 },
  { subject: 'Genetics Fans', A: 86, fullMark: 150 },
  { subject: 'Conservation', A: 99, fullMark: 150 },
  { subject: 'New Keepers', A: 85, fullMark: 150 },
];

const AuditModal = ({ isOpen, onClose, isSyncing, onDownload }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
      <div className="bg-[#33302E] border border-[#45413E] p-10 text-center max-w-lg relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#D2B48C] hover:text-white"><X size={20}/></button>
        <div className="w-16 h-16 bg-[#A84323] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(168,67,35,0.4)]">
          <ShieldCheck className="text-white" size={32} />
        </div>
        <h3 className="text-[#D8D3CC] font-black text-xl uppercase mb-2">
          {isSyncing ? 'Audit Initialized' : 'Audit Complete'}
        </h3>
        <p className="text-[#D2B48C] text-sm mb-8 font-medium leading-relaxed">
          {isSyncing ? 'Scanning Meta Pixel data and Campaign API for anomalies...' : 'Live account data synchronized. Brand report ready for export.'}
        </p>
        <div className="w-full bg-[#1A1817] h-2 mb-8">
          <div className={`bg-[#A84323] h-full transition-all duration-1000 shadow-[0_0_15px_#A84323] ${isSyncing ? 'w-2/3 animate-pulse' : 'w-full'}`}></div>
        </div>
        <div className="flex gap-4 justify-center">
            {!isSyncing && (
                <button onClick={onDownload} className="flex items-center gap-2 bg-[#D8D3CC] text-[#1A1817] px-6 py-3 uppercase text-[10px] font-black tracking-widest hover:bg-white transition-all">
                    <Download size={14} /> Download PDF
                </button>
            )}
            <button onClick={onClose} className="bg-[#A84323] text-white px-6 py-3 uppercase text-[10px] font-black tracking-widest hover:brightness-110 transition-all">
                {isSyncing ? 'Cancel' : 'Close'}
            </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, trend, up }) => (
  <div className="bg-[#33302E] border border-[#45413E] p-6 shadow-xl transition-all hover:border-[#A84323]/50">
    <p className="text-[#D2B48C] text-[10px] uppercase font-black tracking-widest mb-2">{label}</p>
    <div className="flex items-baseline justify-between">
      <h3 className="text-2xl font-bold text-[#D8D3CC]">{value}</h3>
      <div className={`text-[10px] font-bold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>{trend}</div>
    </div>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dateRange, setDateRange] = useState('last_28d'); // Use Meta's standard
  const [metaDataStatus, setMetaDataStatus] = useState({ status: 'Connecting...', connected: false });
  const [realStats, setRealStats] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [campaignData, setCampaignData] = useState([]);
  const [creativeData, setCreativeData] = useState([]);
  const [audienceData, setAudienceData] = useState([]);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [brandAuditData, setBrandAuditData] = useState(null);

  // --- AUTHENTICATION CHECK ---
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const authResult = await authService.checkCollectiveAccess();
        
        if (authResult.authorized) {
          setIsAuthenticated(true);
          setUserData(authResult.user);
          await fetchKeys(); // Load data after successful auth
        } else {
          setIsAuthenticated(false);
          setError('Access denied: The Collective membership required');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setError('Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // --- CORE DATA BRIDGE ---
  const fetchKeys = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsSyncing(true);
      setMetaDataStatus(prev => ({ ...prev, status: 'Syncing Meta...' }));
      setError(null);
      
      // Clear previous data to ensure refresh
      setRealStats([]);
      setCampaignData([]);
      setCreativeData([]);
      setAudienceData([]);
      
      // Fetch comprehensive data
      const [adData, campaignData, creativeData, audienceData] = await Promise.all([
        metaService.getAdAccountData(dateRange),
        metaService.getCampaignPerformance(dateRange),
        metaService.getCreativePerformance(dateRange),
        metaService.getAudienceInsights()
      ]);

      if (adData && adData.status === "Success") {
        setMetaDataStatus({ 
          status: `Connected: ${adData.connected_as}`, 
          connected: true 
        });

        console.log('DEBUG: Processing adData:', adData);
        console.log('DEBUG: adData.meta_data:', adData.meta_data);
        console.log('DEBUG: adData.meta_data length:', adData.meta_data?.length);

        if (adData.meta_data && adData.meta_data.length > 0) {
          const processed = adData.meta_data.map(item => ({
            spend: parseFloat(item.spend) || 0,
            impressions: parseInt(item.impressions) || 0,
            clicks: parseInt(item.clicks) || 0,
            conversions: parseInt(item.conversions) || 0,
            leads: parseInt(item.leads) || 0,
            form_submissions: parseInt(item.form_submissions) || 0,
            purchases: parseInt(item.purchases) || 0,
            revenue: parseFloat(item.revenue) || 0,
            roas: parseFloat(item.roas) || 0,
            date: dateRange
          }));
          console.log('DEBUG: Processed realStats:', processed);
          setRealStats(processed);
        } else {
          console.log('DEBUG: No meta_data found, setting empty realStats');
          setRealStats([]); 
        }

        // Set other data with proper structure
        setCampaignData(campaignData?.campaigns || []);
        setCreativeData(creativeData?.creatives || []);
        setAudienceData(audienceData?.insights || []);

        // Generate benchmark comparison
        const benchmarkComparison = benchmarkService.comparePerformance({
          advertising: metaService.calculateKPIs(adData.meta_data || []),
          social_media: audienceData?.social_metrics || {},
          brand_metrics: {}
        });

        setBenchmarkData(benchmarkComparison);
      } else {
        setMetaDataStatus({ status: 'No Data Found', connected: false });
        setRealStats([]);
      }
    } catch (e) {
      console.error('Data fetch failed:', e);
      setMetaDataStatus({ status: 'Connection Failed', connected: false });
      setError('Failed to fetch data. Please check your Meta connection.');
      setRealStats([]);
    } finally {
      setIsSyncing(false);
    }
  }, [dateRange, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchKeys();
    }
  }, [dateRange, isAuthenticated, fetchKeys]);

  // Handle OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      
      if (code && state) {
        console.log('DEBUG: Processing OAuth callback', { code, state });
        
        try {
          const result = await authService.handleMetaCallback(code, state);
          if (result.success) {
            console.log('DEBUG: OAuth successful', result);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            // Trigger re-authentication check
            window.location.reload();
          }
        } catch (error) {
          console.error('DEBUG: OAuth callback failed', error);
        }
      }
    };

    handleCallback();
  }, []);

  const handleExecuteAudit = async () => {
    setIsModalOpen(true);
    setIsSyncing(true);
    
    try {
      await fetchKeys();
      
      // Conduct brand audit
      const brandAudit = await brandAuditService.conductAudit(
        userData?.brand_data || {},
        audienceData?.social_metrics || {},
        {}
      );
      setBrandAuditData(brandAudit);
      
    } catch (error) {
      console.error('Audit failed:', error);
      setError('Brand audit failed. Please try again.');
    } finally {
      setTimeout(() => setIsSyncing(false), 2000);
    }
  };

  const handleConnectMeta = () => {
    authService.initiateMetaAuth();
  };

  const handleLogout = () => {
    authService.clearAuth();
    setIsAuthenticated(false);
    setUserData(null);
    setError('Access denied: The Collective membership required');
  };

  const renderContent = () => {
    const totalSpend = realStats.reduce((acc, curr) => acc + curr.spend, 0);
    const totalImps = realStats.reduce((acc, curr) => acc + curr.impressions, 0);
    const totalClicks = realStats.reduce((acc, curr) => acc + curr.clicks, 0);
    const totalConversions = realStats.reduce((acc, curr) => acc + curr.conversions, 0);
    const totalLeads = realStats.reduce((acc, curr) => acc + (curr.leads || 0), 0);
    const totalFormSubmissions = realStats.reduce((acc, curr) => acc + (curr.form_submissions || 0), 0);
    const totalPurchases = realStats.reduce((acc, curr) => acc + (curr.purchases || 0), 0);
    const totalRevenue = realStats.reduce((acc, curr) => acc + curr.revenue, 0);
    const avgRoas = realStats.length > 0 
      ? (realStats.reduce((acc, curr) => acc + curr.roas, 0) / realStats.length).toFixed(2) 
      : "0.00";
    const avgCTR = totalImps > 0 ? ((totalClicks / totalImps) * 100).toFixed(2) : "0.00";
    const avgCPC = totalClicks > 0 ? (totalSpend / totalClicks).toFixed(2) : "0.00";
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : "0.00";

    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        {activeTab === 'Overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Spend" value={formatCurrency(totalSpend)} trend="META API" up={totalSpend > 0} />
              <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} trend={`${avgRoas}x`} up={parseFloat(avgRoas) > 0} />
              <StatCard label="Total Leads" value={formatNumber(totalLeads)} trend="LEADS" up={totalLeads > 0} />
              <StatCard label="Total Conversions" value={formatNumber(totalConversions)} trend="CONV" up={totalConversions > 0} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[400px] bg-[#33302E] p-8 border border-[#45413E]">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D2B48C] mb-8">Spend & Revenue Trend</h3>
                 <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={realStats.length > 0 ? realStats : [{spend: 0, revenue: 0}]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#45413E" vertical={false} />
                      <XAxis dataKey="date" hide />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#1A1817', border: 'none', color: '#D8D3CC'}} 
                        formatter={(val, name) => [name === 'revenue' ? formatCurrency(val) : formatCurrency(val), name === 'revenue' ? 'Revenue' : 'Spend']}
                      />
                      <Area type="monotone" dataKey="spend" stroke="#A84323" fill="#A84323" fillOpacity={0.1} strokeWidth={3} />
                      <Line type="monotone" dataKey="revenue" stroke="#D2B48C" strokeWidth={3} dot={false} />
                    </ComposedChart>
                 </ResponsiveContainer>
              </div>
              
              <div className="h-[400px] bg-[#33302E] p-8 border border-[#45413E]">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D2B48C] mb-8">Marketing Actions</h3>
                 <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={[
                      { metric: 'Leads', value: totalLeads, max: Math.max(totalLeads * 1.5, 10) },
                      { metric: 'Form Submits', value: totalFormSubmissions, max: Math.max(totalFormSubmissions * 1.5, 10) },
                      { metric: 'Purchases', value: totalPurchases, max: Math.max(totalPurchases * 1.5, 10) },
                      { metric: 'Conversions', value: totalConversions, max: Math.max(totalConversions * 1.5, 10) }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#45413E" vertical={false} />
                      <XAxis dataKey="metric" tick={{ fill: '#D2B48C', fontSize: 10 }} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#1A1817', border: 'none', color: '#D8D3CC'}} 
                        formatter={(val) => [val.toFixed(0), 'Count']}
                      />
                      <Bar dataKey="value" fill="#A84323" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <StatCard label="Form Submissions" value={formatNumber(totalFormSubmissions)} trend="FORMS" up={totalFormSubmissions > 0} />
              <StatCard label="Purchases" value={formatNumber(totalPurchases)} trend="SALES" up={totalPurchases > 0} />
              <StatCard label="Blended ROAS" value={`${avgRoas}x`} trend="AVG" up={parseFloat(avgRoas) > 2} />
              <StatCard label="Total Impressions" value={formatNumber(totalImps)} trend="REACH" up={totalImps > 0} />
            </div>
            
            {benchmarkData && (
              <div className="bg-[#33302E] border border-[#45413E] p-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D2B48C] mb-6">Industry Benchmark Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#D8D3CC] mb-2">{benchmarkData.overall_score}</div>
                    <div className="text-[10px] uppercase tracking-widest text-[#D2B48C] mb-1">Overall Score</div>
                    <div className={`text-[10px] font-bold ${
                      benchmarkData.grade?.grade.includes('A') ? 'text-emerald-400' : 
                      benchmarkData.grade?.grade.includes('B') ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>{benchmarkData.grade?.grade} - {benchmarkData.grade?.description}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#D8D3CC] mb-2">
                      {benchmarkData.advertising?.roas?.performance === 'above_benchmark' ? '↑' : 
                       benchmarkData.advertising?.roas?.performance === 'below_benchmark' ? '↓' : '→'}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-[#D2B48C] mb-1">ROAS vs Industry</div>
                    <div className="text-[10px] text-[#A84323]">
                    {typeof benchmarkData.advertising?.roas?.member === 'number' ? benchmarkData.advertising.roas.member.toFixed(2) : '0.00'}x vs {typeof benchmarkData.advertising?.roas?.benchmark === 'number' ? benchmarkData.advertising.roas.benchmark.toFixed(2) : '0.00'}x
                  </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#D8D3CC] mb-2">
                      {benchmarkData.advertising?.ctr?.performance === 'above_benchmark' ? '↑' : 
                       benchmarkData.advertising?.ctr?.performance === 'below_benchmark' ? '↓' : '→'}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-[#D2B48C] mb-1">CTR vs Industry</div>
                    <div className="text-[10px] text-[#A84323]">
                    {typeof benchmarkData.advertising?.ctr?.member === 'number' ? benchmarkData.advertising.ctr.member.toFixed(2) : '0.00'}% vs {typeof benchmarkData.advertising?.ctr?.benchmark === 'number' ? benchmarkData.advertising.ctr.benchmark.toFixed(2) : '0.00'}%
                  </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'Campaigns' && (
          <CampaignModule campaignData={campaignData} formatCurrency={formatCurrency} formatNumber={formatNumber} />
        )}
        
        {activeTab === 'Creatives' && (
          <CreativeModule creativeData={creativeData} />
        )}
        
        {activeTab === 'Audiences' && (
          <AudienceModule audienceData={audienceData} />
        )}
        
        {activeTab === 'Budget' && (
          <BudgetModule realStats={realStats} formatCurrency={formatCurrency} />
        )}
        
        {activeTab === 'Insights' && (
          <InsightsModule 
            benchmarkData={benchmarkData} 
            brandAuditData={brandAuditData} 
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        )}
      </div>
    );
  };

  return (
    <AuthGuard 
      isAuthenticated={isAuthenticated}
      loading={loading}
      error={error}
      onConnectMeta={handleConnectMeta}
      onLogout={handleLogout}
      userData={userData}
    >
      <div className="flex h-screen bg-[#1A1817] text-[#D8D3CC] overflow-hidden" style={{ fontFamily: 'Lora, serif' }}>
        <AuditModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          isSyncing={isSyncing} 
          onDownload={() => {
            // PDF download functionality would go here
            console.log('Downloading PDF audit report...');
          }} 
        />
     
      <aside className="w-72 border-r border-[#45413E] bg-[#33302E] flex flex-col z-50">
        <div className="p-8">
          <img src="https://herphub.au/wp-content/uploads/2026/02/cropped-HERP-Hub-AU-Transparent-Background-scaled-1.png" alt="HERP HUB AU" className="w-48 mb-6 mx-auto" />
          <div className="h-px bg-[#45413E] w-full mb-6" />
          <p className="text-[10px] font-black text-[#A84323] tracking-[0.3em] uppercase mb-8 text-center" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}>Marketing & Brand Audit</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {['Overview', 'Campaigns', 'Creatives', 'Audiences', 'Budget', 'Insights'].map((id) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`w-full text-left px-6 py-4 uppercase text-[10px] font-black tracking-widest transition-all ${activeTab === id ? 'bg-[#A84323] text-white shadow-xl' : 'text-[#D2B48C] hover:bg-white/5'}`} style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}>
              {id}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-[#45413E]">
            <div className="p-4 bg-[#5E2C25] rounded border border-[#D8D3CC]/10 shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-1.5 h-1.5 rounded-full ${metaDataStatus.connected ? 'bg-emerald-400' : 'bg-rose-500'} animate-pulse`} />
              <p className="text-[9px] uppercase font-black opacity-60 text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}>System Status</p>
            </div>
            <p className="text-[10px] text-white font-bold truncate" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}>{metaDataStatus.status}</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 border-b border-[#45413E] flex items-center justify-between px-12 bg-[#1A1817]/80 backdrop-blur-xl z-40">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D2B48C]" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}>{activeTab}</h2>
          <div className="flex items-center gap-4">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="bg-[#33302E] border border-[#45413E] text-[#D2B48C] text-[10px] font-black uppercase px-4 py-3 tracking-widest focus:outline-none focus:border-[#A84323] cursor-pointer" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}>
              <option value="last_7d">7 Days</option>
              <option value="last_14d">14 Days</option>
              <option value="last_28d">28 Days</option>
              <option value="last_30d">30 Days</option>
              <option value="maximum">Maximum</option>
            </select>
            <button onClick={handleExecuteAudit} className="bg-[#A84323] text-white text-[10px] font-black uppercase px-8 py-3.5 tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}>
              Execute Brand Audit
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scroll">
          <div className="max-w-6xl mx-auto">{renderContent()}</div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Lora:wght@400;500;600&display=swap');
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: #1A1817; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #45413E; }
      `}} />
    </div>
    </AuthGuard>
  );
};

export default App;