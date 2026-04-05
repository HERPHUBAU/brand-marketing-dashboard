import './index.css';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Megaphone, BarChart3, Users, Calendar, Search, 
  ArrowUpRight, ArrowDownRight, ShieldCheck, TrendingUp, Layers, 
  Scale, Crown, Fingerprint, Award, Zap, Target, ImageIcon, 
  Wallet, Filter, MoreHorizontal, AlertCircle, RefreshCcw, X, CheckCircle2,
  Lightbulb, Rocket, ShieldAlert, Compass
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

/**
 * BRAND & MARKETING - FULLY FUNCTIONAL DASHBOARD
 * - Implemented Campaign Table with Status logic
 * - Implemented Audience Matrix with Market Fit scoring
 * - Implemented "Execute Brand Audit" Interaction
 * - FINAL VERSION: Implemented Insights Module & Strategic Roadmap
 */

// --- CONSTANTS & MOCK DATA ---
const AD_ACCOUNT_NAME = "REPTILE_DIRECT_AU_01";

const GENERATE_TIME_SERIES = (days = 30) => Array.from({ length: days }, (_, i) => ({
  date: `03/${String(i + 1).padStart(2, '0')}`,
  spend: 300 + Math.random() * 500,
  roas: 2.5 + Math.random() * 3,
}));

const INSIGHTS_RADAR_DATA = [
  { subject: 'Brand Recall', A: 120, fullMark: 150 },
  { subject: 'Creative Vitality', A: 98, fullMark: 150 },
  { subject: 'Market Share', A: 86, fullMark: 150 },
  { subject: 'ROAS Efficiency', A: 99, fullMark: 150 },
  { subject: 'Customer LTV', A: 85, fullMark: 150 },
  { subject: 'Retention', A: 65, fullMark: 150 },
];

const CAMPAIGN_DATA = [
  { name: 'Elite Python Series', spend: 4200, roas: 5.2, status: 'Active', ctr: 3.2, conversions: 142 },
  { name: 'Husbandry Essentials', spend: 2100, roas: 3.8, status: 'Active', ctr: 2.1, conversions: 88 },
  { name: 'Varanid Masterclass', spend: 1500, roas: 4.1, status: 'Paused', ctr: 1.8, conversions: 45 },
  { name: 'New Keeper Onboarding', spend: 900, roas: 6.4, status: 'Active', ctr: 4.5, conversions: 112 },
  { name: 'Regional AU Logistics', spend: 400, roas: 1.2, status: 'Ended', ctr: 0.9, conversions: 12 },
];

const AUDIENCE_DATA = [
  { name: 'Advanced Keepers', size: '12k', match: 94, segment: 'High Intent', cpa: 12.40 },
  { name: 'Professional Breeders', size: '4.2k', match: 88, segment: 'B2B', cpa: 45.20 },
  { name: 'Regional AU Enthusiasts', size: '28k', match: 72, segment: 'Growth', cpa: 8.90 },
  { name: 'Elite Collection Owners', size: '1.5k', match: 98, segment: 'Niche', cpa: 112.00 },
];

const CREATIVE_DATA = [
  { id: 1, name: 'Static_Python_Sale_01', spend: 1200, roas: 5.2, ctr: 3.4, tier: 'Top Performer' },
  { id: 2, name: 'Video_Varanid_Enclosure_V2', spend: 3400, roas: 2.1, ctr: 1.2, tier: 'Underperforming' },
  { id: 3, name: 'Carousel_Husbandry_Tips', spend: 850, roas: 4.8, ctr: 4.1, tier: 'Top Performer' },
];

const BUDGET_DATA = [
  { name: 'Elite Python Series', type: 'Daily', limit: 200, spent: 185, status: 'On Track' },
  { name: 'Husbandry Essentials', type: 'Lifetime', limit: 5000, spent: 4800, status: 'Overpacing' },
  { name: 'Varanid Masterclass', type: 'Daily', limit: 100, spent: 20, status: 'Underpacing' },
];

// --- SHARED UI COMPONENTS ---

const StatCard = ({ label, value, trend, up, loading }) => (
  <div className="bg-[#33302E] border border-[#45413E] p-6 border-b-4 border-b-[#A84323]/20 hover:border-b-[#A84323] transition-all duration-300 shadow-xl">
    <p className="text-[#D2B48C] font-montserrat text-[10px] uppercase font-black tracking-[0.2em] mb-2">{label}</p>
    {loading ? (
      <div className="h-8 w-24 bg-[#1A1817] animate-pulse" />
    ) : (
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-lora font-bold text-[#D8D3CC]">{value}</h3>
        <div className={`flex items-center font-montserrat text-[10px] font-bold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
          {up ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
          {trend}
        </div>
      </div>
    )}
  </div>
);

// --- MODAL COMPONENTS ---

const AuditModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const steps = ["Initializing Neural Link", "Analyzing Creative Drift", "Cross-referencing Audience Segments", "Generating Elite Report"];

  useEffect(() => {
    if (isOpen && step < steps.length) {
      const timer = setTimeout(() => setStep(s => s + 1), 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
      <div className="bg-[#33302E] border border-[#45413E] w-full max-w-lg shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-[#A84323] transition-all duration-500" style={{ width: `${(step/steps.length)*100}%` }} />
        <div className="p-10 text-center">
          <h3 className="text-[#D8D3CC] font-montserrat font-black text-xl uppercase tracking-tighter mb-6">Autonomous Brand Audit</h3>
          
          {step < steps.length ? (
            <div className="space-y-6">
              <Zap className="mx-auto text-[#A84323] animate-pulse" size={48} />
              <p className="text-[#D2B48C] font-lora italic text-lg">{steps[step]}...</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <CheckCircle2 className="mx-auto text-emerald-400" size={48} />
              <p className="text-[#D8D3CC] font-lora text-lg">Audit Complete. Account is performing in the <span className="text-[#A84323] font-bold">top 4%</span> of regional benchmarks.</p>
              <button onClick={onClose} className="bg-[#A84323] text-white font-montserrat font-black text-[10px] tracking-widest px-8 py-3 uppercase">Download Report</button>
            </div>
          )}
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#D2B48C] hover:text-white"><X size={20} /></button>
      </div>
    </div>
  );
};

// --- PAGE VIEWS ---

const OverviewPage = ({ data, loading }) => (
  <div className="space-y-10 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Total Spend" value="$14,290" trend="11.2%" up={false} loading={loading} />
      <StatCard label="Total Revenue" value="$58,402" trend="31.5%" up={true} loading={loading} />
      <StatCard label="Blended ROAS" value="4.08x" trend="0.5x" up={true} loading={loading} />
      <StatCard label="Total Impressions" value="1.2M" trend="8.2%" up={true} loading={loading} />
    </div>

    <div className="bg-[#33302E] border border-[#45413E] p-8 shadow-2xl">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-[#D8D3CC] font-montserrat font-black text-xl flex items-center gap-3 uppercase tracking-tighter">
          <TrendingUp size={24} className="text-[#A84323]" /> Efficiency Trajectory
        </h3>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="ochreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A84323" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#A84323" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#45413E" vertical={false} />
            <XAxis dataKey="date" stroke="#D2B48C" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" stroke="#D2B48C" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#A84323" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#33302E', 
                border: '1px solid #444',
                borderRadius: '8px' 
              }}
              formatter={(value) => [value.toFixed(2), ""]}
            />          
            <Area yAxisId="left" type="monotone" dataKey="spend" stroke="#D8D3CC" strokeWidth={2} fill="transparent" />
            <Area yAxisId="right" type="monotone" dataKey="roas" stroke="#A84323" strokeWidth={3} fill="url(#ochreGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const CampaignsPage = () => (
  <div className="bg-[#33302E] border border-[#45413E] shadow-2xl overflow-hidden animate-in fade-in duration-500">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#1A1817]/40 border-b border-[#45413E]">
          <tr>
            <th className="p-6 text-[#D2B48C] font-montserrat text-[10px] uppercase tracking-widest font-black">Campaign Identity</th>
            <th className="p-6 text-[#D2B48C] font-montserrat text-[10px] uppercase tracking-widest font-black">Status</th>
            <th className="p-6 text-[#D2B48C] font-montserrat text-[10px] uppercase tracking-widest font-black">Spend</th>
            <th className="p-6 text-[#D2B48C] font-montserrat text-[10px] uppercase tracking-widest font-black">ROAS</th>
            <th className="p-6 text-[#D2B48C] font-montserrat text-[10px] uppercase tracking-widest font-black">Conversions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#45413E]">
          {CAMPAIGN_DATA.map((c, i) => (
            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
              <td className="p-6 font-lora font-bold text-[#D8D3CC]">{c.name}</td>
              <td className="p-6">
                <span className={`text-[9px] font-black uppercase px-3 py-1 ${
                  c.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' : 
                  c.status === 'Paused' ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20' : 
                  'text-rose-400 bg-rose-400/10 border border-rose-400/20'
                }`}>
                  {c.status}
                </span>
              </td>
              <td className="p-6 font-montserrat text-[#D2B48C]">${c.spend.toLocaleString()}</td>
              <td className="p-6 font-montserrat font-bold text-[#D8D3CC]">{c.roas}x</td>
              <td className="p-6 font-montserrat text-[#D2B48C]">{c.conversions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AudiencesPage = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
    {AUDIENCE_DATA.map((aud, i) => (
      <div key={i} className="bg-[#33302E] border border-[#45413E] p-8 flex flex-col justify-between hover:border-[#A84323] transition-colors group">
        <div>
          <Users size={20} className="text-[#A84323] mb-6 group-hover:scale-110 transition-transform" />
          <h5 className="text-[#D8D3CC] font-lora font-bold text-xl mb-1">{aud.name}</h5>
          <p className="text-[#D2B48C] text-[10px] uppercase font-black mb-6 tracking-widest opacity-60">{aud.segment}</p>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-[#45413E] pb-3">
            <span className="text-[#D2B48C] text-[10px] font-black uppercase tracking-tighter">Size</span>
            <span className="text-[#D8D3CC] font-bold text-sm">{aud.size}</span>
          </div>
          <div className="flex justify-between items-end border-b border-[#45413E] pb-3">
            <span className="text-[#D2B48C] text-[10px] font-black uppercase tracking-tighter">CPA Avg</span>
            <span className="text-[#D8D3CC] font-bold text-sm">${aud.cpa}</span>
          </div>
          <div className="pt-2">
            <div className="flex justify-between text-[10px] uppercase font-black mb-2">
              <span className="text-[#D2B48C]">Market Fit</span>
              <span className="text-[#A84323]">{aud.match}%</span>
            </div>
            <div className="h-1 w-full bg-[#1A1817]">
              <div className="h-full bg-[#A84323]" style={{ width: `${aud.match}%` }} />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const CreativesPage = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
    {CREATIVE_DATA.map((creative) => (
      <div key={creative.id} className="bg-[#33302E] border border-[#45413E] overflow-hidden group shadow-xl hover:border-[#A84323] transition-all">
        <div className="aspect-video bg-[#1A1817] flex items-center justify-center relative overflow-hidden">
          <ImageIcon size={48} className="text-[#45413E] group-hover:scale-110 transition-transform duration-700" />
          <div className={`absolute top-4 right-4 px-3 py-1 text-[8px] font-black uppercase tracking-widest ${
            creative.tier === 'Top Performer' ? 'bg-emerald-500 text-white' : 
            creative.tier === 'Underperforming' ? 'bg-rose-500 text-white' : 'bg-[#D2B48C] text-[#1A1817]'
          }`}>
            {creative.tier}
          </div>
        </div>
        <div className="p-6">
          <h4 className="text-[#D8D3CC] font-lora font-bold text-lg mb-4 truncate">{creative.name}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[#D2B48C] text-[10px] font-black uppercase tracking-widest">Spend</p>
              <p className="text-[#D8D3CC] font-bold">${creative.spend}</p>
            </div>
            <div>
              <p className="text-[#D2B48C] text-[10px] font-black uppercase tracking-widest">ROAS</p>
              <p className="text-[#A84323] font-bold">{creative.roas}x</p>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const BudgetPage = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {BUDGET_DATA.map((item, i) => (
        <div key={i} className="bg-[#33302E] border border-[#45413E] p-8 shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <h5 className="text-[#D8D3CC] font-lora font-bold text-lg">{item.name}</h5>
            <span className={`text-[8px] font-black uppercase px-2 py-1 ${
              item.status === 'On Track' ? 'bg-emerald-500/10 text-emerald-400' :
              item.status === 'Overpacing' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
            }`}>{item.status}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-black tracking-widest">
              <span className="text-[#D2B48C]">Utilization</span>
              <span className="text-[#D8D3CC]">{Math.round((item.spent/item.limit)*100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#1A1817]">
               <div className="h-full bg-[#A84323]" style={{ width: `${(item.spent/item.limit)*100}%` }} />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#45413E] flex justify-between items-end">
            <div>
              <p className="text-[#D2B48C] text-[10px] font-black uppercase tracking-widest opacity-60">Spent to Date</p>
              <p className="text-[#D8D3CC] font-bold text-xl">${item.spent}</p>
            </div>
            <div className="text-right">
              <p className="text-[#D2B48C] text-[10px] font-black uppercase tracking-widest opacity-60">Daily Limit</p>
              <p className="text-[#D8D3CC] font-bold text-xl">${item.limit}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const InsightsPage = () => (
  <div className="space-y-10 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Brand Health Radar */}
      <div className="bg-[#33302E] border border-[#45413E] p-8 shadow-2xl">
        <h3 className="text-[#D8D3CC] font-montserrat font-black text-xl flex items-center gap-3 uppercase tracking-tighter mb-8">
          <Compass size={24} className="text-[#A84323]" /> Brand Health Vector
        </h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={INSIGHTS_RADAR_DATA}>
              <PolarGrid stroke="#45413E" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#D2B48C', fontSize: 10, fontWeight: 700 }} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
              <Radar
                name="Performance"
                dataKey="A"
                stroke="#A84323"
                fill="#A84323"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strategic Roadmap */}
      <div className="bg-[#33302E] border border-[#45413E] p-8 shadow-2xl">
        <h3 className="text-[#D8D3CC] font-montserrat font-black text-xl flex items-center gap-3 uppercase tracking-tighter mb-8">
          <Lightbulb size={24} className="text-amber-400" /> Strategic Roadmap
        </h3>
        <div className="space-y-6">
          <div className="flex gap-6 p-4 bg-[#1A1817]/40 border-l-4 border-l-emerald-500">
            <Rocket className="text-emerald-500 shrink-0" size={24} />
            <div>
              <h5 className="text-[#D8D3CC] font-lora font-black text-sm uppercase">Scale High-Efficiency Hub</h5>
              <p className="text-[#D2B48C] text-xs mt-1 leading-relaxed">Increase budget by 25% for <span className="text-white italic">Elite Python Series</span> to capture untapped weekend demand.</p>
            </div>
          </div>
          <div className="flex gap-6 p-4 bg-[#1A1817]/40 border-l-4 border-l-rose-500">
            <ShieldAlert className="text-rose-500 shrink-0" size={24} />
            <div>
              <h5 className="text-[#D8D3CC] font-lora font-black text-sm uppercase">Creative Fatigue Mitigation</h5>
              <p className="text-[#D2B48C] text-xs mt-1 leading-relaxed"><span className="text-white italic">Varanid Masterclass</span> assets show 40% CTR decay. Refresh with UGC-style testimonials.</p>
            </div>
          </div>
          <div className="flex gap-6 p-4 bg-[#1A1817]/40 border-l-4 border-l-[#A84323]">
            <Target className="text-[#A84323] shrink-0" size={24} />
            <div>
              <h5 className="text-[#D8D3CC] font-lora font-black text-sm uppercase">Lookalike Expansion</h5>
              <p className="text-[#D2B48C] text-xs mt-1 leading-relaxed">Deploy 1% LAL from <span className="text-white italic">Advanced Keepers</span> segment to test lower funnel viability.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- MAIN APPLICATION ENTRY ---

const App = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isAuditOpen, setAuditOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setData(GENERATE_TIME_SERIES(30));
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <OverviewPage data={data} loading={loading} />;
      case 'Campaigns': return <CampaignsPage />;
      case 'Creatives': return <CreativesPage />;
      case 'Audiences': return <AudiencesPage />;
      case 'Budget': return <BudgetPage />;
      case 'Insights': return <InsightsPage />;
      default: return <OverviewPage data={data} loading={loading} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#1A1817] text-[#D8D3CC] overflow-hidden">
      <AuditModal isOpen={isAuditOpen} onClose={() => setAuditOpen(false)} />

      {/* Sidebar Navigation */}
      <aside className="w-72 border-r border-[#45413E] bg-[#33302E] flex flex-col z-50">
        <div className="p-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#A84323] flex items-center justify-center shadow-lg shadow-[#A84323]/30">
              <Layers className="text-white" size={22} />
            </div>
            <div className="font-montserrat leading-none">
              <div className="font-black text-xl tracking-tighter text-[#D8D3CC]">BRAND</div>
              <div className="font-light text-sm tracking-[0.3em] text-[#A84323]">& MARKETING</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'Overview', icon: LayoutDashboard },
            { id: 'Campaigns', icon: Megaphone },
            { id: 'Creatives', icon: ImageIcon },
            { id: 'Audiences', icon: Users },
            { id: 'Budget', icon: Wallet },
            { id: 'Insights', icon: BarChart3 },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-all font-montserrat group ${
                activeTab === tab.id ? 'bg-[#A84323] text-white shadow-xl' : 'text-[#D2B48C] hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-white' : 'group-hover:text-[#D8D3CC]'} />
              <span className="text-[10px] font-black tracking-widest uppercase">{tab.id}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-[#45413E]">
          <div className="bg-[#1A1817] p-4 border border-[#45413E] flex items-center gap-3">
            <ShieldCheck size={20} className="text-[#A84323]" />
            <div>
              <p className="text-[8px] font-montserrat font-black uppercase text-[#D2B48C] tracking-widest">Active Account</p>
              <p className="text-[10px] font-lora font-bold text-[#D8D3CC] mt-1">{AD_ACCOUNT_NAME}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main UI */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 border-b border-[#45413E] flex items-center justify-between px-12 bg-[#1A1817]/60 backdrop-blur-2xl z-40">
          <div className="flex items-center gap-8">
            <h2 className="text-[10px] font-montserrat font-black text-[#D2B48C] uppercase tracking-[0.5em]">{activeTab}</h2>
            <div className="h-10 w-px bg-[#45413E]" />
            <div className="flex items-center gap-3 text-[10px] font-montserrat font-bold text-[#D8D3CC] bg-[#33302E] px-6 py-3 border border-[#45413E]">
              <Calendar size={14} className="text-[#A84323]" /> MAR 01 - MAR 31
            </div>
          </div>
          <div className="flex gap-4">
             <button className="text-[#D2B48C] p-3 border border-[#45413E] hover:bg-[#A84323] hover:text-white transition-all"><Search size={18} /></button>
             <button 
               onClick={() => setAuditOpen(true)}
               className="bg-[#A84323] text-white font-montserrat text-[10px] font-black uppercase px-8 py-3.5 tracking-[0.2em] shadow-lg hover:brightness-110 active:scale-95 transition-all"
             >
               Execute Brand Audit
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scroll bg-[radial-gradient(circle_at_top_right,#A8432308,transparent_40%)]">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Lora:ital,wght@0,400;0,700;1,400&display=swap');
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        .font-lora { font-family: 'Lora', serif; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: #1A1817; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #45413E; }
      `}} />
    </div>
  );
};

export default App;