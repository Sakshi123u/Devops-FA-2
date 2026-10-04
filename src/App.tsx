import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FilePlus2,
  CalendarClock,
  ClipboardList,
  Recycle,
  Award,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  ArrowRight,
  Upload,
  User,
  Leaf,
  BarChart3,
  Sparkles,
  ChevronRight,
  Check
} from 'lucide-react';

// Spring Boot Backend REST API Base URL
// When running locally alongside Spring Boot, it connects to http://localhost:8080/api
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080/api';

// --- TYPES ---
export type TabType = 
  | 'dashboard' 
  | 'report' 
  | 'pickup' 
  | 'my-reports' 
  | 'centers' 
  | 'eco-points' 
  | 'admin';

export type ReportStatus = 'Pending' | 'Assigned' | 'Pickup Scheduled' | 'Collected' | 'Recycled';
export type PriorityLevel = 'Low' | 'Medium' | 'High';

export interface WasteReport {
  id: string;
  user: string;
  wasteType: string;
  location: string;
  description: string;
  date: string;
  priority: PriorityLevel;
  status: ReportStatus;
  imageUrl?: string;
}

export interface PickupRequest {
  id: string;
  wasteType: string;
  quantityKg: number;
  date: string;
  timeSlot: string;
  address: string;
  notes?: string;
  status: 'Scheduled' | 'Completed' | 'In Progress';
}

export interface RecyclingCenter {
  id: string;
  name: string;
  location: string;
  distance: string;
  materials: string[];
  capacity: number;
  status: 'Open' | 'Closed' | 'Near Capacity';
  contact: string;
  timings: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  isCurrentUser?: boolean;
  avatarBg: string;
}

// --- INITIAL MOCK DATA ---
const INITIAL_REPORTS: WasteReport[] = [
  {
    id: 'RPT-001',
    user: 'Sakshi',
    wasteType: 'Plastic',
    location: 'Shivajinagar, Pune',
    description: 'Bulk accumulation of plastic bottles and containers near civic garden.',
    date: 'Oct 04, 2026',
    priority: 'Medium',
    status: 'Pending',
  },
  {
    id: 'RPT-002',
    user: 'Rahul',
    wasteType: 'E-Waste',
    location: 'Aundh IT Corridor, Pune',
    description: 'Old computer peripherals and discarded wiring bundles.',
    date: 'Oct 03, 2026',
    priority: 'High',
    status: 'Assigned',
  },
  {
    id: 'RPT-003',
    user: 'Sakshi',
    wasteType: 'Organic',
    location: 'Kothrud Market, Pune',
    description: 'Vegetable market surplus organic matter ready for composting.',
    date: 'Oct 02, 2026',
    priority: 'Low',
    status: 'Collected',
  },
  {
    id: 'RPT-004',
    user: 'Priya',
    wasteType: 'Metal',
    location: 'Hadapsar Industrial Zone',
    description: 'Scrap aluminum siding and metal fittings from renovation.',
    date: 'Sep 30, 2026',
    priority: 'Medium',
    status: 'Recycled',
  },
  {
    id: 'RPT-005',
    user: 'Sakshi',
    wasteType: 'Paper',
    location: 'FC Road, Deccan',
    description: 'Stacked cardboard packaging and discarded paper rolls.',
    date: 'Sep 28, 2026',
    priority: 'Low',
    status: 'Recycled',
  }
];

const INITIAL_PICKUPS: PickupRequest[] = [
  {
    id: 'PCK-101',
    wasteType: 'Paper & Cardboard',
    quantityKg: 15,
    date: 'Oct 06, 2026',
    timeSlot: '9 AM – 11 AM',
    address: 'Flat 402, Green Meadows, Shivajinagar',
    status: 'Scheduled',
  },
  {
    id: 'PCK-102',
    wasteType: 'Plastic',
    quantityKg: 10,
    date: 'Sep 29, 2026',
    timeSlot: '2 PM – 4 PM',
    address: 'Lane 5, Prabhat Road, Pune',
    status: 'Completed',
  }
];

const INITIAL_CENTERS: RecyclingCenter[] = [
  {
    id: 'RC-1',
    name: 'Pimpri Recycling Center',
    location: 'Old Mumbai-Pune Highway, Pimpri',
    distance: '3.2 km away',
    materials: ['Plastic', 'Paper', 'Metal', 'Glass'],
    capacity: 72,
    status: 'Open',
    contact: '+91 20 2742 8800',
    timings: '8:00 AM – 7:00 PM',
  },
  {
    id: 'RC-2',
    name: 'Aundh Green Hub',
    location: 'Near Parihar Chowk, Aundh, Pune',
    distance: '1.8 km away',
    materials: ['Plastic', 'E-Waste', 'Organic'],
    capacity: 48,
    status: 'Open',
    contact: '+91 20 2588 1234',
    timings: '9:00 AM – 6:00 PM',
  },
  {
    id: 'RC-3',
    name: 'Kothrud Eco Center',
    location: 'Paud Road, Kothrud, Pune',
    distance: '4.5 km away',
    materials: ['Paper', 'Glass', 'Metal', 'Organic'],
    capacity: 88,
    status: 'Near Capacity',
    contact: '+91 20 2538 9090',
    timings: '8:30 AM – 6:30 PM',
  },
  {
    id: 'RC-4',
    name: 'Viman Nagar Recycling Hub',
    location: 'Symbiosis Road, Viman Nagar, Pune',
    distance: '6.1 km away',
    materials: ['E-Waste', 'Plastic', 'Metal'],
    capacity: 35,
    status: 'Open',
    contact: '+91 20 2663 4500',
    timings: '9:00 AM – 8:00 PM',
  }
];

const LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Rahul Sharma', points: 950, avatarBg: 'bg-emerald-600' },
  { rank: 2, name: 'Sakshi Pandharkar', points: 840, isCurrentUser: true, avatarBg: 'bg-emerald-700' },
  { rank: 3, name: 'Priya Joshi', points: 790, avatarBg: 'bg-teal-600' },
  { rank: 4, name: 'Aditya Kulkarni', points: 720, avatarBg: 'bg-green-700' },
  { rank: 5, name: 'Neha Deshmukh', points: 680, avatarBg: 'bg-emerald-800' },
];

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Sakshi',
    fullName: 'Sakshi Pandharkar',
    email: 'sakshi.pandharkar23@pccoepune.org',
    role: 'Eco Champion',
    points: 840,
    recycledKg: 68,
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Application Data State
  const [reports, setReports] = useState<WasteReport[]>(INITIAL_REPORTS);
  const [pickups, setPickups] = useState<PickupRequest[]>(INITIAL_PICKUPS);
  const [centers, setCenters] = useState<RecyclingCenter[]>(INITIAL_CENTERS);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Synchronize with Spring Boot REST API on load (if running)
  useEffect(() => {
    async function syncBackendData() {
      try {
        const [repRes, pckRes, cntRes] = await Promise.all([
          fetch(`${API_BASE_URL}/reports`),
          fetch(`${API_BASE_URL}/pickups`),
          fetch(`${API_BASE_URL}/centers`),
        ]);

        if (repRes.ok) {
          const data = await repRes.json();
          if (Array.isArray(data) && data.length > 0) setReports(data);
        }
        if (pckRes.ok) {
          const data = await pckRes.json();
          if (Array.isArray(data) && data.length > 0) setPickups(data);
        }
        if (cntRes.ok) {
          const data = await cntRes.json();
          if (Array.isArray(data) && data.length > 0) setCenters(data);
        }
      } catch {
        // Spring Boot backend is offline or in local fallback mode
      }
    }
    syncBackendData();
  }, []);

  // Login handler with Spring Boot POST /api/auth/login integration
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') as string) || '';
    const password = (formData.get('password') as string) || '';

    // Attempt Spring Boot REST API authentication
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const body = await res.json();
        if (body.user) {
          const user = body.user;
          const isAdminRole = user.role?.toLowerCase().includes('admin');
          setIsAdmin(isAdminRole);
          setCurrentUser({
            name: user.name,
            fullName: user.fullName || user.name,
            email: user.email,
            role: user.role,
            points: user.points || 840,
            recycledKg: user.recycledKg || 68,
          });
          setActiveTab(isAdminRole ? 'admin' : 'dashboard');
          setIsAuthenticated(true);
          showToast(`Welcome back, ${user.name}!`);
          return;
        }
      }
    } catch {
      // Local fallback
    }

    if (email.toLowerCase().includes('admin')) {
      setIsAdmin(true);
      setCurrentUser({
        name: 'Admin',
        fullName: 'Municipal Administrator',
        email: 'admin@ecocycle.com',
        role: 'System Administrator',
        points: 1500,
        recycledKg: 420,
      });
      setActiveTab('admin');
      showToast('Logged in as Administrator');
    } else {
      setIsAdmin(false);
      setCurrentUser({
        name: 'Sakshi',
        fullName: 'Sakshi Pandharkar',
        email: email || 'sakshi.pandharkar23@pccoepune.org',
        role: 'Eco Champion',
        points: 840,
        recycledKg: 68,
      });
      setActiveTab('dashboard');
      showToast('Welcome back, Sakshi!');
    }
    setIsAuthenticated(true);
  };

  // Create Report Handler (Connected to Spring Boot POST /api/reports)
  const handleCreateReport = async (newReport: WasteReport) => {
    setReports(prev => [newReport, ...prev]);
    try {
      await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport)
      });
    } catch {
      // Handled in state
    }
    showToast('Report submitted successfully! Thank you for helping keep your community clean.');
    setActiveTab('my-reports');
  };

  // Create Pickup Handler (Connected to Spring Boot POST /api/pickups)
  const handleCreatePickup = async (newPickup: PickupRequest) => {
    setPickups(prev => [newPickup, ...prev]);
    try {
      await fetch(`${API_BASE_URL}/pickups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPickup)
      });
    } catch {
      // Handled in state
    }
    showToast('Pickup scheduled successfully!');
    setActiveTab('dashboard');
  };

  // Update Status Handler (Connected to Spring Boot PATCH /api/reports/{id}/status)
  const handleUpdateReportStatus = async (id: string, status: ReportStatus) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      await fetch(`${API_BASE_URL}/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch {
      // Handled in state
    }
    showToast(`Report ${id} updated to "${status}"`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    showToast('Logged out successfully');
  };

  // Status Badge Helper
  const getStatusBadge = (status: ReportStatus | string) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">Pending</span>;
      case 'Assigned':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">Assigned</span>;
      case 'Pickup Scheduled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">Pickup Scheduled</span>;
      case 'Collected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">Collected</span>;
      case 'Recycled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">Recycled</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'High':
        return <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">High</span>;
      case 'Medium':
        return <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Medium</span>;
      case 'Low':
        return <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Low</span>;
    }
  };

  // ==========================================
  // VIEW: AUTHENTICATION SCREEN (LOGIN / REGISTER)
  // ==========================================
  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // ==========================================
  // MAIN APP SHELL
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-900 text-white px-5 py-3 rounded-xl shadow-lg border border-emerald-700 flex items-center gap-3 transition-all duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* MOBILE TOP BAR */}
      <header className="md:hidden bg-emerald-950 text-white px-4 py-3.5 flex items-center justify-between border-b border-emerald-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Recycle className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">EcoCycle</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-900 rounded-lg transition"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* MOBILE DRAWER BACKDROP */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* RESPONSIVE SIDEBAR NAVIGATION */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 h-screen w-64 bg-emerald-950 text-emerald-100 flex flex-col z-50 transition-transform duration-200 ease-in-out border-r border-emerald-900/60 shrink-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-emerald-900/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-white shadow-md shadow-emerald-900/40">
            <Recycle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight">EcoCycle</h1>
            <p className="text-xs text-emerald-400/80 font-medium">Smart Waste & Recycling</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400/60">
            Citizen Portal
          </div>

          <SidebarItem
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard"
            isActive={activeTab === 'dashboard'}
            onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
          />
          <SidebarItem
            icon={<FilePlus2 className="w-5 h-5" />}
            label="Report Waste"
            isActive={activeTab === 'report'}
            onClick={() => { setActiveTab('report'); setIsMobileMenuOpen(false); }}
          />
          <SidebarItem
            icon={<CalendarClock className="w-5 h-5" />}
            label="Schedule Pickup"
            isActive={activeTab === 'pickup'}
            onClick={() => { setActiveTab('pickup'); setIsMobileMenuOpen(false); }}
          />
          <SidebarItem
            icon={<ClipboardList className="w-5 h-5" />}
            label="My Reports"
            badge={reports.length.toString()}
            isActive={activeTab === 'my-reports'}
            onClick={() => { setActiveTab('my-reports'); setIsMobileMenuOpen(false); }}
          />
          <SidebarItem
            icon={<MapPin className="w-5 h-5" />}
            label="Recycling Centers"
            isActive={activeTab === 'centers'}
            onClick={() => { setActiveTab('centers'); setIsMobileMenuOpen(false); }}
          />
          <SidebarItem
            icon={<Award className="w-5 h-5" />}
            label="Eco Points"
            isActive={activeTab === 'eco-points'}
            onClick={() => { setActiveTab('eco-points'); setIsMobileMenuOpen(false); }}
          />

          <div className="pt-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400/60">
            Operations
          </div>
          <SidebarItem
            icon={<ShieldCheck className="w-5 h-5" />}
            label="Admin Dashboard"
            isActive={activeTab === 'admin'}
            onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }}
          />
        </nav>

        {/* User Profile Card & Logout */}
        <div className="p-4 border-t border-emerald-900/80 bg-emerald-950/80">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-emerald-900/50 mb-2 border border-emerald-800/40">
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-sm shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{currentUser.fullName}</p>
              <div className="flex items-center gap-1 text-xs text-emerald-300">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span className="truncate">{currentUser.role}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-emerald-300 hover:text-white hover:bg-emerald-900/70 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              user={currentUser}
              reports={reports}
              pickups={pickups}
              onNavigate={(tab) => setActiveTab(tab)}
              getStatusBadge={getStatusBadge}
            />
          )}

          {activeTab === 'report' && (
            <ReportWasteView
              onSubmitReport={handleCreateReport}
            />
          )}

          {activeTab === 'pickup' && (
            <SchedulePickupView
              onSubmitPickup={handleCreatePickup}
            />
          )}

          {activeTab === 'my-reports' && (
            <MyReportsView
              reports={reports}
              getStatusBadge={getStatusBadge}
              getPriorityBadge={getPriorityBadge}
              onGoToReport={() => setActiveTab('report')}
            />
          )}

          {activeTab === 'centers' && (
            <RecyclingCentersView
              centers={centers}
            />
          )}

          {activeTab === 'eco-points' && (
            <EcoPointsView
              user={currentUser}
              leaderboard={LEADERBOARD}
            />
          )}

          {activeTab === 'admin' && (
            <AdminDashboardView
              reports={reports}
              pickups={pickups}
              onUpdateReportStatus={handleUpdateReportStatus}
              getStatusBadge={getStatusBadge}
              getPriorityBadge={getPriorityBadge}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// SUBCOMPONENT: SIDEBAR NAV ITEM
// ==========================================
function SidebarItem({
  icon,
  label,
  isActive,
  badge,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
        isActive
          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/30'
          : 'text-emerald-200/90 hover:text-white hover:bg-emerald-900/60'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={isActive ? 'text-white' : 'text-emerald-400'}>{icon}</span>
        <span>{label}</span>
      </div>
      {badge && (
        <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-emerald-700 text-white' : 'bg-emerald-900 text-emerald-300'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// ==========================================
// VIEW: 1. DASHBOARD
// ==========================================
function DashboardView({
  user,
  reports,
  pickups,
  onNavigate,
  getStatusBadge
}: {
  user: { name: string; recycledKg: number; points: number };
  reports: WasteReport[];
  pickups: PickupRequest[];
  onNavigate: (tab: TabType) => void;
  getStatusBadge: (status: string) => React.ReactNode;
}) {
  const targetMonthlyGoal = 100;
  const remainingGoal = Math.max(0, targetMonthlyGoal - user.recycledKg);
  const progressPercent = Math.min(100, Math.round((user.recycledKg / targetMonthlyGoal) * 100));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Good morning, {user.name} 👋
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Let's make our city cleaner and greener.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('report')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>Report Waste</span>
          </button>
          <button
            onClick={() => onNavigate('pickup')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-sm transition"
          >
            <CalendarClock className="w-4 h-4" />
            <span>Schedule Pickup</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Waste Reports"
          value="12"
          sub="3 active this week"
          icon={<FilePlus2 className="w-5 h-5 text-emerald-600" />}
          bg="bg-emerald-50"
        />
        <StatCard
          label="Pickups"
          value="5"
          sub="1 scheduled next"
          icon={<CalendarClock className="w-5 h-5 text-blue-600" />}
          bg="bg-blue-50"
        />
        <StatCard
          label="Eco Points"
          value={user.points.toString()}
          sub="Rank #2 on leaderboard"
          icon={<Award className="w-5 h-5 text-amber-600" />}
          bg="bg-amber-50"
        />
        <StatCard
          label="Waste Recycled"
          value={`${user.recycledKg} kg`}
          sub="68% of monthly quota"
          icon={<Recycle className="w-5 h-5 text-teal-600" />}
          bg="bg-teal-50"
        />
      </div>

      {/* Recycling Progress & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recycling Progress Bar */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-600" />
                Recycling Progress
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Monthly Goal
              </span>
            </div>
            <p className="text-xs text-slate-500">Track and meet your monthly diversion target.</p>

            <div className="mt-6 mb-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{user.recycledKg}</span>
              <span className="text-sm font-semibold text-slate-400">/ {targetMonthlyGoal} kg</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
              <p className="text-xs text-emerald-900 font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{remainingGoal} kg more to reach your monthly goal.</span>
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-500">
            <span>Level: Eco Champion</span>
            <button 
              onClick={() => onNavigate('eco-points')}
              className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
            >
              View Rewards <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800">Recent Activity</h3>
              <p className="text-xs text-slate-500">Real-time status of your contributions</p>
            </div>
            <button
              onClick={() => onNavigate('my-reports')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              See All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 mt-0.5">
                  <FilePlus2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Plastic waste reported</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" /> Location: Shivajinagar
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-xs text-slate-400">Oct 04</span>
                {getStatusBadge('Pending')}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700 mt-0.5">
                  <CalendarClock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Pickup scheduled</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" /> Date: October 6 (9 AM – 11 AM)
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-xs text-slate-400">Oct 06</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  Scheduled
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-700 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Organic compost verified</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" /> Location: Kothrud Center
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-xs text-slate-400">Oct 02</span>
                {getStatusBadge('Collected')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  bg
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div className={`p-2 rounded-xl ${bg}`}>{icon}</div>
      </div>
      <div className="mt-3">
        <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
        <p className="text-xs text-slate-400 mt-1 truncate">{sub}</p>
      </div>
    </div>
  );
}

// ==========================================
// VIEW: 2. REPORT WASTE
// ==========================================
function ReportWasteView({
  onSubmitReport
}: {
  onSubmitReport: (report: WasteReport) => void;
}) {
  const [wasteType, setWasteType] = useState('Plastic');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [fileName, setFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !description.trim()) {
      return;
    }

    setIsSubmitting(true);
    // Simulating API latency / prepare for Spring Boot: POST /api/reports
    setTimeout(() => {
      const newReport: WasteReport = {
        id: `RPT-00${Math.floor(Math.random() * 900) + 100}`,
        user: 'Sakshi',
        wasteType,
        location,
        description,
        date: 'Oct 04, 2026',
        priority,
        status: 'Pending',
        imageUrl: fileName ? 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80' : undefined
      };
      setIsSubmitting(false);
      onSubmitReport(newReport);
    }, 600);
  };

  const quickLocations = ['Shivajinagar', 'Kothrud', 'Aundh', 'Viman Nagar', 'Hadapsar', 'FC Road'];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <Leaf className="w-3.5 h-3.5" />
            Citizen Action
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Report Waste Problem</h2>
          <p className="text-sm text-slate-500 mt-1">
            Submit an uncollected garbage pile, overflowing bin, or discarded recyclable material.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Waste Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Waste Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Plastic', 'Paper', 'Glass', 'Metal', 'Organic', 'E-Waste', 'Mixed Waste'].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setWasteType(type)}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition ${
                    wasteType === type
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Location / Landmark *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Near Shivajinagar Bus Stand, Pune"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
            {/* Quick Location suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 font-medium">Quick pick:</span>
              {quickLocations.map(loc => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setLocation(`${loc}, Pune`)}
                  className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-md transition"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the type and scale of waste, accessibility, or specific instructions..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Upload Image (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-4 text-center bg-slate-50 transition cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFileName(e.target.files[0].name);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <p className="text-xs font-medium text-slate-700">
                {fileName ? `Attached: ${fileName}` : 'Click to select or drag photo of waste'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG up to 5MB</p>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Priority
            </label>
            <div className="flex gap-3">
              {(['Low', 'Medium', 'High'] as PriorityLevel[]).map((lvl) => (
                <label
                  key={lvl}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border cursor-pointer text-xs font-medium transition ${
                    priority === lvl
                      ? lvl === 'High'
                        ? 'border-rose-500 bg-rose-50 text-rose-800'
                        : lvl === 'Medium'
                        ? 'border-amber-500 bg-amber-50 text-amber-800'
                        : 'border-emerald-500 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    checked={priority === lvl}
                    onChange={() => setPriority(lvl)}
                    className="sr-only"
                  />
                  <span>{lvl}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Submitting report...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// VIEW: 3. SCHEDULE PICKUP
// ==========================================
function SchedulePickupView({
  onSubmitPickup
}: {
  onSubmitPickup: (pickup: PickupRequest) => void;
}) {
  const [wasteType, setWasteType] = useState('Paper & Cardboard');
  const [quantityKg, setQuantityKg] = useState('15');
  const [pickupDate, setPickupDate] = useState('2026-10-08');
  const [timeSlot, setTimeSlot] = useState('9 AM – 11 AM');
  const [address, setAddress] = useState('Flat 402, Green Meadows, Shivajinagar, Pune');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '9 AM – 11 AM',
    '11 AM – 1 PM',
    '2 PM – 4 PM',
    '4 PM – 6 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !pickupDate) return;

    setIsSubmitting(true);
    // Simulating API call for Spring Boot: POST /api/pickups
    setTimeout(() => {
      const newPickup: PickupRequest = {
        id: `PCK-${Math.floor(Math.random() * 900) + 100}`,
        wasteType,
        quantityKg: parseFloat(quantityKg) || 10,
        date: pickupDate,
        timeSlot,
        address,
        notes,
        status: 'Scheduled',
      };
      setIsSubmitting(false);
      onSubmitPickup(newPickup);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <CalendarClock className="w-3.5 h-3.5" />
            Doorstep Collection
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Schedule Waste Pickup</h2>
          <p className="text-sm text-slate-500 mt-1">
            Book our electric eco-vans to collect segregated dry recyclables directly from your doorstep.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Waste Type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Waste Type *
              </label>
              <select
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="Paper & Cardboard">Paper & Cardboard</option>
                <option value="Plastic Bottles & Containers">Plastic Bottles & Containers</option>
                <option value="E-Waste & Electronics">E-Waste & Electronics</option>
                <option value="Glassware & Bottles">Glassware & Bottles</option>
                <option value="Metal & Aluminum Cans">Metal & Aluminum Cans</option>
                <option value="Mixed Recyclables">Mixed Recyclables</option>
              </select>
            </div>

            {/* Estimated Quantity */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Estimated Quantity (kg) *
              </label>
              <input
                type="number"
                min="1"
                max="500"
                required
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pickup Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Pickup Date *
              </label>
              <input
                type="date"
                required
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Time Slot *
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pickup Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Pickup Address *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Apartment/House, Street, Area, City"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Ring bell 402, waste is boxed up in cardboard cartons..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {/* Information Notice */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center gap-2.5 text-xs text-blue-900">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>You earn <strong>10 Eco Points</strong> automatically upon successful completion of each pickup.</span>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Scheduling your pickup...</span>
              ) : (
                <>
                  <CalendarClock className="w-4 h-4" />
                  <span>Schedule Pickup</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// VIEW: 4. MY REPORTS
// ==========================================
function MyReportsView({
  reports,
  getStatusBadge,
  getPriorityBadge,
  onGoToReport
}: {
  reports: WasteReport[];
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityBadge: (priority: PriorityLevel) => React.ReactNode;
  onGoToReport: () => void;
}) {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Collected' | 'Recycled'>('All');

  const filteredReports = reports.filter((r) => {
    if (filter === 'All') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Reports</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Track status updates on civic waste incidents you have reported.
          </p>
        </div>

        <button
          onClick={onGoToReport}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>New Report</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['All', 'Pending', 'Collected', 'Recycled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
              filter === tab
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Report ID</th>
                <th className="px-6 py-3.5">Waste Type</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No waste reports found for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-mono font-medium text-slate-900 text-xs">
                      {report.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {report.wasteType}
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                      {report.location}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {report.date}
                    </td>
                    <td className="px-6 py-4">
                      {getPriorityBadge(report.priority)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(report.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {filteredReports.length === 0 ? (
          <div className="bg-white p-8 text-center text-slate-400 rounded-2xl border border-slate-200 text-sm">
            No waste reports found for the selected filter.
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-800">{report.id}</span>
                {getStatusBadge(report.status)}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{report.wasteType} Waste</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{report.location}</span>
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{report.date}</span>
                <div>{getPriorityBadge(report.priority)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==========================================
// VIEW: 5. RECYCLING CENTERS
// ==========================================
function RecyclingCentersView({
  centers
}: {
  centers: RecyclingCenter[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCenter, setSelectedCenter] = useState<RecyclingCenter | null>(null);

  const filteredCenters = centers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.materials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Recycling Centers</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Discover authorized recycling hubs and drop-off points in your city.
          </p>
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recycling centers..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
          />
        </div>
      </div>

      {/* Grid of Centers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCenters.map((center) => (
          <div
            key={center.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{center.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{center.location}</span>
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  center.status === 'Open'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {center.status}
                </span>
              </div>

              {/* Accepted Materials */}
              <div className="mt-4">
                <span className="text-xs text-slate-400 font-medium">Accepted Materials:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {center.materials.map(mat => (
                    <span
                      key={mat}
                      className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Current Capacity</span>
                  <span className="font-semibold text-slate-800">{center.capacity}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      center.capacity > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${center.capacity}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">{center.distance}</span>
              <button
                onClick={() => setSelectedCenter(center)}
                className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Location / Details Modal */}
      {selectedCenter && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Authorized Facility
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedCenter.name}</h3>
              </div>
              <button
                onClick={() => setSelectedCenter(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <strong>Address:</strong> {selectedCenter.location}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <strong>Timings:</strong> {selectedCenter.timings}
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <strong>Helpline:</strong> {selectedCenter.contact}
                </p>
              </div>

              <div>
                <strong className="block text-slate-700 mb-1">Materials processed on site:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCenter.materials.map(m => (
                    <span key={m} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  alert(`Navigating to ${selectedCenter.name} (${selectedCenter.location})`);
                  setSelectedCenter(null);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
              >
                Get Directions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// VIEW: 6. ECO POINTS & LEADERBOARD
// ==========================================
function EcoPointsView({
  user,
  leaderboard
}: {
  user: { name: string; fullName: string; points: number; role: string };
  leaderboard: LeaderboardUser[];
}) {
  const nextLevelThreshold = 1000;
  const pointsRemaining = nextLevelThreshold - user.points;
  const progressPercent = Math.min(100, Math.round((user.points / nextLevelThreshold) * 100));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Eco Points & Rewards</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Earn points for recycling responsibly and climb the community leaderboard.
        </p>
      </div>

      {/* Gamification Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-xs font-semibold text-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Active Level: {user.role}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black tracking-tight">{user.points}</span>
            <span className="text-emerald-200 text-base font-semibold">Eco Points</span>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-emerald-200 mb-1.5 font-medium">
              <span>Level Progress ({user.points} / {nextLevelThreshold} pts)</span>
              <span>{pointsRemaining > 0 ? `${pointsRemaining} pts to Eco Master` : 'Max tier achieved'}</span>
            </div>
            <div className="w-full bg-emerald-950/60 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* How to Earn Points */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            How You Earn Points
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  ♻️
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Plastic recycling</p>
                  <p className="text-xs text-slate-500">Per verified kilogram</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                +10 points
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  📄
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Paper recycling</p>
                  <p className="text-xs text-slate-500">Per verified kilogram</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                +5 points
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                  ⚡
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">E-Waste recycling</p>
                  <p className="text-xs text-slate-500">Per processed device</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                +25 points
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  🚚
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Successful pickup</p>
                  <p className="text-xs text-slate-500">Completed doorstep dispatch</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                +10 points
              </span>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <Award className="w-4 h-4 text-amber-500" />
              Community Leaderboard
            </h3>
            <span className="text-xs text-slate-400 font-medium">Pune Zone</span>
          </div>

          <div className="space-y-2">
            {leaderboard.map((item) => (
              <div
                key={item.rank}
                className={`p-3 rounded-xl flex items-center justify-between border transition ${
                  item.isCurrentUser
                    ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400/40'
                    : 'bg-white border-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center font-bold text-xs ${
                    item.rank === 1 ? 'text-amber-500 font-black' : 'text-slate-400'
                  }`}>
                    #{item.rank}
                  </span>
                  <div className={`w-8 h-8 rounded-full ${item.avatarBg} text-white flex items-center justify-center text-xs font-bold`}>
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${item.isCurrentUser ? 'text-emerald-950 font-bold' : 'text-slate-800'}`}>
                      {item.name}
                      {item.isCurrentUser && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-emerald-600 text-white rounded font-normal">
                          You
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900">{item.points}</span>
                  <span className="text-xs text-slate-400 ml-1">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// VIEW: 7. ADMIN DASHBOARD
// ==========================================
function AdminDashboardView({
  reports,
  pickups,
  onUpdateReportStatus,
  getStatusBadge,
  getPriorityBadge
}: {
  reports: WasteReport[];
  pickups: PickupRequest[];
  onUpdateReportStatus: (id: string, status: ReportStatus) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityBadge: (priority: PriorityLevel) => React.ReactNode;
}) {
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);

  // Statistics Calculation
  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'Pending').length;
  const scheduledPickups = pickups.filter(p => p.status === 'Scheduled').length;
  const completedPickups = pickups.filter(p => p.status === 'Completed').length;
  const totalRecycledWasteKg = 340; // Total mock aggregation for municipal depot

  // Waste categories distribution
  const categoryCounts: Record<string, number> = {
    'Plastic': 42,
    'Paper': 28,
    'Organic': 18,
    'E-Waste': 8,
    'Metal': 4,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Municipal Sanitation Management Portal
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Operations Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch trucks, review incoming citizen reports, and monitor recycling operations.
          </p>
        </div>
      </div>

      {/* 5 Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Total Reports</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalReports}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-amber-600 font-medium">Pending Reports</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingReports}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-purple-600 font-medium">Scheduled Pickups</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{scheduledPickups}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-blue-600 font-medium">Completed Pickups</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{completedPickups}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 col-span-2 lg:col-span-1">
          <p className="text-xs text-emerald-600 font-medium">Total Recycled</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{totalRecycledWasteKg} kg</p>
        </div>
      </div>

      {/* Lightweight Visual Charts (Using clean CSS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Waste by Category */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-1">1. Waste Collected by Category</h4>
          <p className="text-xs text-slate-400 mb-4">Proportion by material weight</p>
          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([cat, pct]) => (
              <div key={cat}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{cat}</span>
                  <span className="font-semibold text-slate-500">{pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Monthly Recycling Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">2. Monthly Recycling Trend</h4>
            <p className="text-xs text-slate-400 mb-4">Metric tons recycled in 2026</p>
            <div className="h-36 flex items-end justify-between gap-2 pt-6 px-2">
              {[
                { month: 'Jun', value: 45, height: '45%' },
                { month: 'Jul', value: 60, height: '60%' },
                { month: 'Aug', value: 75, height: '75%' },
                { month: 'Sep', value: 90, height: '90%' },
                { month: 'Oct', value: 100, height: '100%' },
              ].map(bar => (
                <div key={bar.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-semibold text-slate-600">{bar.value}t</span>
                  <div
                    className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-t-md transition-all"
                    style={{ height: bar.height }}
                  />
                  <span className="text-[10px] text-slate-400 font-medium">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-medium">
            ↗ +11.2% growth compared to previous quarter
          </div>
        </div>

        {/* Chart 3: Report Status Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">3. Report Status Distribution</h4>
            <p className="text-xs text-slate-400 mb-4">Breakdown of all active tickets</p>
            <div className="space-y-2.5">
              {[
                { status: 'Pending', count: reports.filter(r => r.status === 'Pending').length, color: 'bg-amber-500' },
                { status: 'Assigned', count: reports.filter(r => r.status === 'Assigned').length, color: 'bg-blue-500' },
                { status: 'Collected', count: reports.filter(r => r.status === 'Collected').length, color: 'bg-emerald-500' },
                { status: 'Recycled', count: reports.filter(r => r.status === 'Recycled').length, color: 'bg-green-600' },
              ].map(item => (
                <div key={item.status} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="font-medium text-slate-700">{item.status}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.count} tickets</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Average ticket turnaround: 18 hours
          </div>
        </div>
      </div>

      {/* Recent Waste Reports Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Waste Reports</h3>
            <p className="text-xs text-slate-500">Live ticket queue ready for assignment and dispatch</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Report ID</th>
                <th className="px-5 py-3">Citizen</th>
                <th className="px-5 py-3">Waste Type</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-mono font-medium text-slate-900 text-xs">
                    {report.id}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-800 text-xs">
                    {report.user}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-700">
                    {report.wasteType}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-600 max-w-xs truncate">
                    {report.location}
                  </td>
                  <td className="px-5 py-3.5">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                      >
                        View
                      </button>

                      <select
                        value={report.status}
                        onChange={(e) => onUpdateReportStatus(report.id, e.target.value as ReportStatus)}
                        className="px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Pickup Scheduled">Pickup Scheduled</option>
                        <option value="Collected">Collected</option>
                        <option value="Recycled">Recycled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-slate-400">TICKET DETAILS</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedReport.id}</h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400">Citizen:</span>
                  <p className="font-semibold text-slate-800">{selectedReport.user}</p>
                </div>
                <div>
                  <span className="text-slate-400">Waste Type:</span>
                  <p className="font-semibold text-slate-800">{selectedReport.wasteType}</p>
                </div>
                <div>
                  <span className="text-slate-400">Date Filed:</span>
                  <p className="font-semibold text-slate-800">{selectedReport.date}</p>
                </div>
                <div>
                  <span className="text-slate-400">Priority:</span>
                  <div>{getPriorityBadge(selectedReport.priority)}</div>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700">Location:</span>
                <p className="mt-0.5 text-slate-800">{selectedReport.location}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-700">Description:</span>
                <p className="mt-0.5 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {selectedReport.description}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-700">Current Status:</span>
                <div className="mt-1 flex items-center gap-2">
                  {getStatusBadge(selectedReport.status)}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// VIEW: 8. LOGIN / REGISTRATION SCREEN
// ==========================================
function AuthScreen({
  onLogin
}: {
  onLogin: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('sakshi.pandharkar23@pccoepune.org');
  const [password, setPassword] = useState('user123');

  const fillAdminCredentials = () => {
    setEmail('admin@ecocycle.com');
    setPassword('admin123');
  };

  const fillUserCredentials = () => {
    setEmail('sakshi.pandharkar23@pccoepune.org');
    setPassword('user123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        {/* Logo and App Title */}
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-tr from-emerald-600 to-green-400 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-600/30 mb-3">
            <Recycle className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">EcoCycle</h1>
          <p className="text-xs text-emerald-700 font-semibold mt-0.5">
            Smart Waste Management & Recycling Platform
          </p>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h2 className="text-lg font-bold text-slate-800 text-center">
            {isRegisterMode ? 'Create Citizen Account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-slate-500 text-center mt-1">
            {isRegisterMode ? 'Join thousands of citizens making cities clean' : 'Sign in to access your recycling dashboard'}
          </p>
        </div>

        {/* Demo Credential Quick Buttons */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Quick Demo Credentials:
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillUserCredentials}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-emerald-100/60 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-900 transition text-left"
            >
              <div>👤 Citizen: Sakshi</div>
              <div className="text-[10px] text-emerald-700 font-normal">sakshi@ecocycle.com</div>
            </button>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-emerald-100/60 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-900 transition text-left"
            >
              <div>🛡️ Administrator</div>
              <div className="text-[10px] text-emerald-700 font-normal">admin@ecocycle.com</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={onLogin} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                defaultValue="Sakshi Pandharkar"
                placeholder="e.g. Sakshi Pandharkar"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sakshi@ecocycle.com or admin@ecocycle.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2"
          >
            <span>{isRegisterMode ? 'Create Account' : 'Login'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-slate-500">
          {isRegisterMode ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className="font-bold text-emerald-700 hover:underline"
              >
                Login
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className="font-bold text-emerald-700 hover:underline"
              >
                Register
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
