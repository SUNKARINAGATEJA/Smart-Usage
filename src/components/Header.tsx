import React from 'react';
import {
  Building2,
  FileSpreadsheet,
  PieChart,
  Target,
  Sparkles,
  Plus,
  RefreshCw,
  Zap,
  Bot,
  LogOut,
} from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
  onOpenBankConnect: () => void;
  onOpenAICoach: () => void;
  onSyncNow: () => void;
  isSyncing: boolean;
  currentUser: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenBankConnect,
  onOpenAICoach,
  onSyncNow,
  isSyncing,
  currentUser,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'banks', label: 'Bank Accounts', icon: Building2 },
    { id: 'report', label: 'Monthly AI Report', icon: Sparkles, badge: 'AI' },
    { id: 'transactions', label: 'Transactions', icon: FileSpreadsheet },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'goals', label: 'Goals & Rules', icon: Zap },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single Wordmark Brand */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('dashboard');
              }}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="text-emerald-400 font-extrabold text-lg tracking-wider">₹</span>
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Smart<span className="text-emerald-400 font-light">Usage</span>
              </span>
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
                    isActive
                      ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sync Now Button */}
            <button
              onClick={onSyncNow}
              disabled={isSyncing}
              title="Trigger Realtime Bank Sync"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Banks'}</span>
            </button>

            {/* AI Financial Coach */}
            <button
              onClick={onOpenAICoach}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-700/50 shadow-sm transition-all hover:shadow-emerald-500/10"
            >
              <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Ask AI Coach</span>
            </button>

            {/* Add Transaction */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>New Entry</span>
            </button>

            {/* User Profile & Sign Out */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-800/60 overflow-x-auto gap-2 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
