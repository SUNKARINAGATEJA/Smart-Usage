import React from 'react';
import { RefreshCw, ShieldCheck, PlusCircle } from 'lucide-react';
import { BankAccount } from '../types';

interface RealtimeSyncBarProps {
  bankAccounts: BankAccount[];
  isSyncing: boolean;
  onTriggerSync: () => void;
  onOpenBankConnect: () => void;
  lastSyncTime?: string;
}

export const RealtimeSyncBar: React.FC<RealtimeSyncBarProps> = ({
  bankAccounts,
  isSyncing,
  onTriggerSync,
  onOpenBankConnect,
  lastSyncTime,
}) => {
  const syncedCount = bankAccounts.filter((a) => a.syncStatus === 'synced').length;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border-y border-slate-800/80 px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-semibold tracking-wide">
              REALTIME BANK SYNC
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {syncedCount} of {bankAccounts.length} Linked Accounts
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">
              Last synced:{' '}
              <span className="text-slate-200 font-mono">
                {lastSyncTime
                  ? new Date(lastSyncTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })
                  : 'Just now'}
              </span>
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium border border-emerald-500/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync Live Bank Statement</span>
          </button>

          <button
            onClick={onOpenBankConnect}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium border border-slate-700 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Link Indian Bank</span>
          </button>
        </div>
      </div>
    </div>
  );
};
