import { useEffect, useState, useCallback } from "react";
import { RefreshCw, X, LayoutDashboard, MessageSquare, Sliders } from "lucide-react";
import type { Affiliate, Dashboard as DashboardData } from "./api/endpoints";
import { getAffiliates, getDashboard } from "./api/endpoints";
import { AffiliateList } from "./components/AffiliateList";
import { AffiliateDetail } from "./components/AffiliateDetail";
import { Dashboard } from "./components/Dashboard";
import { ChatInterface } from "./components/ChatInterface";
import { PipelineControls } from "./components/PipelineControls";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

type Tab = "dashboard" | "chat" | "pipeline";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { key: "chat",      label: "AI Chat",   icon: <MessageSquare className="h-4 w-4" />   },
  { key: "pipeline",  label: "Pipeline",  icon: <Sliders className="h-4 w-4" />         },
];

export default function App() {
  const [affiliates,        setAffiliates]        = useState<Affiliate[]>([]);
  const [dashboard,         setDashboard]          = useState<DashboardData | null>(null);
  const [selectedAffiliate, setSelectedAffiliate]  = useState<Affiliate | null>(null);
  const [activeTab,         setActiveTab]          = useState<Tab>("dashboard");
  const [loading,           setLoading]            = useState(true);
  const [refreshing,        setRefreshing]         = useState(false);

  const fetchData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const [affiliatesRes, dashboardRes] = await Promise.allSettled([
        getAffiliates(),
        getDashboard(),
      ]);
      if (affiliatesRes.status === "fulfilled") setAffiliates(affiliatesRes.value.data);
      if (dashboardRes.status  === "fulfilled") setDashboard(dashboardRes.value.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 60_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-primary-600 text-white px-4 py-3 flex items-center justify-between shadow-md z-10">
        <div>
          <h1 className="text-base font-bold tracking-tight">Affiliate Intelligence Platform</h1>
          <p className="text-xs text-primary-200 mt-0.5">AI-powered affiliate relationship management</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-xs text-primary-100 hover:text-white transition-colors disabled:opacity-50"
        >
          {refreshing
            ? <LoadingSpinner size="sm" className="border-white/30 border-t-white" />
            : <RefreshCw className="h-3.5 w-3.5" />}
          Refresh
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Affiliates
              {affiliates.length > 0 && (
                <span className="ml-1.5 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-xs font-medium">
                  {affiliates.length}
                </span>
              )}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center pt-12">
                <LoadingSpinner />
              </div>
            ) : (
              <AffiliateList
                affiliates={affiliates}
                selected={selectedAffiliate}
                onSelect={setSelectedAffiliate}
              />
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <nav className="flex-shrink-0 bg-white border-b border-gray-200 px-4">
            <div className="flex">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === t.key
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Tab content */}
          <div className="flex-1 overflow-auto">
            {activeTab === "dashboard" && (
              <Dashboard affiliates={affiliates} dashboard={dashboard} loading={loading} />
            )}
            {activeTab === "chat"      && <ChatInterface />}
            {activeTab === "pipeline"  && <PipelineControls />}
          </div>
        </main>

        {/* Right detail panel */}
        <div
          className={`flex-shrink-0 bg-white border-l border-gray-200 overflow-hidden transition-all duration-300 ${
            selectedAffiliate ? "w-80" : "w-0"
          }`}
        >
          {selectedAffiliate && (
            <div className="w-80 h-full flex flex-col">
              <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Detail</h2>
                <button
                  onClick={() => setSelectedAffiliate(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <AffiliateDetail affiliate={selectedAffiliate} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}